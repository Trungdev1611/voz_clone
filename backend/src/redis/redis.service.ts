import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { join } from 'path';
import { createClient } from 'redis';

/** Client `redis` (SCAN, SADD, INCRBY, …) — khác với API get/set của cache-manager. */
export type NativeRedisClient = ReturnType<typeof createClient>;

/**
 * Một service, hai cách dùng Redis:
 * - **cache-manager** (`get` / `set` / `del` / `notEx`): Keyv + TTL, phù hợp cache key–value đơn giản.
 * - **Client native** (`getNativeClient`, dùng nội bộ cho `sadd` / `incre` / …): lệnh Redis đặc thù + cron SCAN.
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private native!: NativeRedisClient;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async onModuleInit() {
    const host = process.env.REDIS_HOST ?? 'localhost';
    const port = Number(process.env.REDIS_PORT) || 6379;
    const url = `redis://${host}:${port}`;
    this.native = createClient({ url });
    this.native.on('error', (err: Error) =>
      this.logger.error(`Redis native: ${err.message}`),
    );
    await this.native.connect();
  }

  async onModuleDestroy() {
    if (this.native?.isOpen) {
      await this.native.quit();
    }
  }

  /** Cho cron / code cần `SCAN`, `GET`, … trực tiếp (không qua cache-manager). */
  getNativeClient(): NativeRedisClient {
    return this.native;
  }

  async set(key: string, value: unknown, ttl?: number) {
    await this.cacheManager.set(key, value, ttl);
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.cacheManager.get<T>(key);
    return value ?? null;
  }

  async del(key: string) {
    await this.cacheManager.del(key);
  }

  /**
   * Dùng lệnh SETNX của Redis để đảm bảo tính nguyên tử (Atomic)
   * Không bị tranh chấp dữ liệu khi nhiều người truy cập cùng lúc
   */
  async notEx(key: string, value: unknown, ttl?: number): Promise<boolean> {
    // const existing = await this.cacheManager.get(key);
    // if (existing !== undefined) {
    //   return false;
    // }
    // await this.cacheManager.set(key, value, ttl);
    // return true;
    const result = await this.native.set(key, JSON.stringify(value), {
      NX: true,
      EX: ttl,
    });
    return result === 'OK';
  }

  async sadd(key: string, member: string | number): Promise<number> {
    return this.native.sAdd(key, String(member));
  }

  async getTtl(key: string): Promise<number> {
    return this.native.ttl(key);
  }

  async incre(key: string, incrementBy: number = 1): Promise<number> {
    return this.native.incrBy(key, incrementBy);
  }

  async expire(key: string, ttl: number): Promise<void> {
    await this.native.expire(key, ttl);
  }
}
