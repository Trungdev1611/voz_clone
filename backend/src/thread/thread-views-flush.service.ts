import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from 'src/redis/redis.service';
import { ThreadRepository } from './thread.repository';

/**
 * Key view trong Redis do `ThreadService` tạo: `thread:{id}:views`.
 * Regex lấy `id` → đọc số (delta) → xóa key → cộng delta vào cột `views` trong DB.
 *
 * (SCAN cần client Redis trực tiếp; cache-manager/Keyv không có API quét key.)
 */
const VIEW_KEY_RE = /^thread:(\d+):views$/;

@Injectable()
export class ThreadViewsFlushService {
  private readonly logger = new Logger(ThreadViewsFlushService.name);

  constructor(
    private readonly redis: RedisService,
    private readonly threads: ThreadRepository,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async flushViewCounters() {
    const client = this.redis.getNativeClient();
    let cursor = '0';
    let keysSeen = 0;
    let threadsUpdated = 0;

    try {
      do {
        const { cursor: next, keys } = await client.scan(cursor, {
          MATCH: 'thread:*:views',
          COUNT: 128,
        });
        cursor = next;

        for (const key of keys) {
          keysSeen++;
          const m = key.match(VIEW_KEY_RE);
          if (!m) continue;

          const threadId = Number(m[1]);
          const raw = await client.get(key);
          const delta = raw ? Number.parseInt(raw, 10) : 0;

          if (!Number.isFinite(delta) || delta < 1) {
            await client.del(key);
            continue;
          }

          try {
            await this.threads.incrementViewsById(threadId, delta);
            await client.del(key);
            threadsUpdated++;
          } catch (err) {
            this.logger.warn(
              `Không cộng view thread ${threadId} (+${delta}), giữ key Redis để cron sau thử lại: ${err instanceof Error ? err.message : err}`,
            );
          }
        }
      } while (cursor !== '0');

      if (threadsUpdated > 0) {
        this.logger.log(
          `Đồng bộ view: ${threadsUpdated} thread, ${keysSeen} key đã quét.`,
        );
      }
    } catch (e) {
      this.logger.error(
        'flushViewCounters thất bại',
        e instanceof Error ? e.stack : e,
      );
    }
  }
}
