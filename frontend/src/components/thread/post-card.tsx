import type { ThreadPostDisplay } from "@/types/thread";

function Avatar({ author, hue }: { author: string; hue: number }) {
  const initial = author.slice(0, 1).toUpperCase();
  return (
    <div
      className="mx-auto flex h-14 w-14 items-center justify-center rounded border border-[var(--forum-border)] font-display text-xl font-bold text-white shadow-inner"
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 55% 42%), hsl(${hue} 45% 28%))`,
      }}
      aria-hidden
    >
      {initial}
    </div>
  );
}

export function PostCard({ post }: { post: ThreadPostDisplay }) {
  return (
    <article
      id={`post-${post.id}`}
      className="forum-post flex flex-col border-b border-[var(--forum-border)] last:border-b-0 md:flex-row"
    >
      <div className="forum-post-user flex w-full flex-row gap-3 border-b border-[var(--forum-border)] bg-[var(--forum-panel)] p-3 md:w-[200px] md:flex-col md:border-b-0 md:border-r md:py-4">
        <Avatar author={post.author} hue={post.avatarHue} />
        <div className="min-w-0 flex-1 text-[12px] md:text-center">
          <p className="font-semibold text-[var(--forum-link)]">{post.author}</p>
          <p className="mt-1 text-[11px] text-[var(--forum-muted)]">
            {post.userTitle}
          </p>
          <dl className="mt-2 space-y-0.5 text-left text-[10px] text-[var(--forum-muted)] md:text-center">
            <div>
              <dt className="inline opacity-70">Tham gia:</dt>{" "}
              <dd className="inline font-mono text-[var(--forum-text)]">
                {post.joinDate}
              </dd>
            </div>
            <div>
              <dt className="inline opacity-70">Bài viết:</dt>{" "}
              <dd className="inline font-mono text-[var(--forum-text)]">
                {post.postCount.toLocaleString("vi-VN")}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="min-w-0 flex-1 bg-[var(--forum-bg)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--forum-border)] bg-[var(--forum-panel)] px-3 py-1.5 text-[11px] text-[var(--forum-muted)]">
          <span>
            <span className="font-mono text-[var(--forum-text)]">#{post.index}</span>
            <span className="mx-2 text-[var(--forum-border-strong)]">·</span>
            {post.createdAt}
          </span>
          <span className="opacity-60">Báo cáo · Trích dẫn (API)</span>
        </div>
        <div className="post-body px-3 py-4 text-[13px] leading-relaxed text-[var(--forum-text)]">
          {post.body.split("\n").map((line: string, i: number) => (
            <p key={i} className={i > 0 ? "mt-3" : ""}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
