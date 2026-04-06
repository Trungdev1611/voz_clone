import Link from "next/link";
import type { MockForum, MockThread } from "@/lib/mock-forum";

export function ThreadListTable({
  forum,
  threads,
}: {
  forum: MockForum;
  threads: MockThread[];
}) {
  return (
    <section className="overflow-hidden rounded border border-[var(--forum-border)]">
      <div className="forum-category-head flex flex-wrap items-center justify-between gap-2 px-3 py-2">
        <h1 className="text-[14px] font-semibold text-[var(--forum-text)]">
          {forum.name}
        </h1>
        <div className="flex gap-2">
          <button
            type="button"
            disabled
            className="rounded border border-[var(--forum-border)] bg-[var(--forum-panel)] px-2 py-1 text-[11px] text-[var(--forum-muted)]"
          >
            + Chủ đề mới (API)
          </button>
        </div>
      </div>
      {threads.length === 0 ? (
        <p className="border-t border-[var(--forum-border)] bg-[var(--forum-bg)] px-3 py-8 text-center text-[13px] text-[var(--forum-muted)]">
          Chưa có chủ đề — sau này hiển thị danh sách từ API.
        </p>
      ) : (
        <div className="overflow-x-auto border-t border-[var(--forum-border)]">
          <table className="forum-table w-full min-w-[720px] border-collapse text-left text-[12px]">
            <thead>
              <tr className="forum-table-head text-[11px] uppercase tracking-wide text-[var(--forum-muted)]">
                <th className="px-3 py-2 font-medium">Tiêu đề</th>
                <th className="w-16 px-2 py-2 text-center font-medium">Trả lời</th>
                <th className="w-16 px-2 py-2 text-center font-medium">Xem</th>
                <th className="min-w-[180px] px-3 py-2 font-medium">
                  Cập nhật
                </th>
              </tr>
            </thead>
            <tbody>
              {threads.map((t) => (
                <tr
                  key={t.id}
                  className="border-t border-[var(--forum-border)] bg-[var(--forum-bg)] hover:bg-[var(--forum-row-hover)]"
                >
                  <td className="px-3 py-2 align-top">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {t.isPinned && (
                        <span className="rounded bg-[var(--forum-pill-pin)] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[var(--forum-pill-pin-text)]">
                          Ghim
                        </span>
                      )}
                      {t.isLocked && (
                        <span className="rounded bg-[var(--forum-pill-lock)] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[var(--forum-pill-lock-text)]">
                          Khóa
                        </span>
                      )}
                      <Link
                        href={`/threads/${t.id}`}
                        className="font-medium text-[var(--forum-link)] hover:text-[var(--forum-link-hover)] hover:underline"
                      >
                        {t.title}
                      </Link>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[var(--forum-muted)]">
                      bởi {t.author}
                    </p>
                  </td>
                  <td className="px-2 py-2 text-center font-mono text-[var(--forum-text)]">
                    {t.replyCount.toLocaleString("vi-VN")}
                  </td>
                  <td className="px-2 py-2 text-center font-mono text-[var(--forum-text)]">
                    {t.viewCount.toLocaleString("vi-VN")}
                  </td>
                  <td className="px-3 py-2 align-top text-[11px] text-[var(--forum-muted)]">
                    <span className="text-[var(--forum-accent-text)]">
                      {t.lastPostBy}
                    </span>
                    <br />
                    {t.lastPostAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
