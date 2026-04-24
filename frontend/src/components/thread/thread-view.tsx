import type { ThreadPostDisplay, ThreadViewHeader } from "@/types/thread";
import { PostCard } from "./post-card";
import { useMeQuery } from "@/hooks/auth/use-auth";

export function ThreadView({
  thread,
  posts,
}: {
  thread: ThreadViewHeader;
  posts: ThreadPostDisplay[];
}) {
  const { data: me } = useMeQuery();
  const isAuthenticated = me?.id;
  return (
    <section className="overflow-hidden rounded border border-[var(--forum-border)]">
      <div className="forum-category-head px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          {thread.isPinned && (
            <span className="rounded bg-[var(--forum-pill-pin)] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[var(--forum-pill-pin-text)]">
              Ghim
            </span>
          )}
          {thread.isLocked && (
            <span className="rounded bg-[var(--forum-pill-lock)] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[var(--forum-pill-lock-text)]">
              Khóa
            </span>
          )}
          <h1 className="text-[15px] font-semibold leading-snug text-[var(--forum-text)]">
            {thread.title}
          </h1>
        </div>
        <p className="mt-1 text-[11px] text-[var(--forum-muted)]">
          Trả lời: {thread.replyCount.toLocaleString("vi-VN")} · Lượt xem:{" "}
          {thread.viewCount.toLocaleString("vi-VN")}
        </p>
      </div>
      <div className="border-t border-[var(--forum-border)]">
        {posts.length === 0 ? (
          <p className="px-3 py-8 text-center text-[13px] text-[var(--forum-muted)]">
            Chưa có bài viết.
          </p>
        ) : (
          posts.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </div>
      <div className="border-t border-[var(--forum-border)] bg-[var(--forum-panel)] px-3 py-3">
        <p className="text-[12px] text-[var(--forum-muted)]">
          Ô trả lời nhanh / editor BBCode sẽ đặt ở đây khi có API đăng nhập &amp; post.
        </p>
        <textarea
        //disabled textarea if user is not authenticated
          disabled={!isAuthenticated}
          rows={4}
          className="forum-input mt-2 w-full resize-y rounded border border-[var(--forum-border)] bg-[var(--forum-bg)] p-2 text-[13px] text-[var(--forum-muted)]"
          placeholder="Viết trả lời… (bật khi đã auth)"
        />
      </div>
    </section>
  );
}
