import Link from "next/link";
import type { CategoryRow } from "@/hooks/categories/type";

function formatCount(value: number | null | undefined): string {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return n.toLocaleString("vi-VN");
}

export function ForumCategoryBlock({
  category,
}: {
  category: CategoryRow;
}) {
  return (
    <section className="mb-5 overflow-hidden rounded border border-[var(--forum-border)]">
      <div className="forum-category-head px-3 py-2 text-[13px] font-semibold text-[var(--forum-text)]">
        {category.name}
      </div>
      <div className="overflow-x-auto border-t border-[var(--forum-border)]">
        <table className="forum-table w-full min-w-[640px] border-collapse text-left text-[12px]">
          <thead>
            <tr className="forum-table-head text-[11px] uppercase tracking-wide text-[var(--forum-muted)]">
              <th className="px-3 py-2 font-medium">Diễn đàn</th>
              <th className="w-20 px-2 py-2 text-center font-medium">Chủ đề</th>
              <th className="w-20 px-2 py-2 text-center font-medium">Bài viết</th>
              <th className="min-w-[200px] px-3 py-2 font-medium">
                Bài viết cuối
              </th>
            </tr>
          </thead>
          <tbody>
            {category.forums.map((f) => {
              const lastTitle =
                f.last_thread_title?.trim() || "Chưa có chủ đề nổi bật";
              const lastBy = f.last_post_by?.trim() || "—";
              const lastAt = f.last_post_at?.trim() || "—";
              return (
                <tr
                  key={f.id}
                  className="border-t border-[var(--forum-border)] bg-[var(--forum-bg)] hover:bg-[var(--forum-row-hover)]"
                >
                  <td className="px-3 py-2.5 align-top">
                    <Link
                      href={`/forums/${f.slug}`}
                      className="font-semibold text-[var(--forum-link)] hover:text-[var(--forum-link-hover)] hover:underline"
                    >
                      {f.name}
                    </Link>
                    <p className="mt-0.5 max-w-xl text-[11px] leading-snug text-[var(--forum-muted)]">
                      {f.description ?? ""}
                    </p>
                  </td>
                  <td className="px-2 py-2.5 text-center font-mono text-[var(--forum-text)]">
                    {formatCount(f.post_count)}
                  </td>
                  <td className="px-2 py-2.5 text-center font-mono text-[var(--forum-text)]">
                    {formatCount(f.message_count)}
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    <Link
                      href={`/forums/${f.slug}`}
                      className="line-clamp-2 text-[var(--forum-link)] hover:underline"
                    >
                      {lastTitle}
                    </Link>
                    <p className="mt-0.5 text-[11px] text-[var(--forum-muted)]">
                      bởi{" "}
                      <span className="text-[var(--forum-accent-text)]">
                        {lastBy}
                      </span>{" "}
                      · {lastAt}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
