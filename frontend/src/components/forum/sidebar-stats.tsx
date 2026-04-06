export function SidebarStats() {
  return (
    <aside className="space-y-3 text-[12px]">
      <div className="forum-panel overflow-hidden rounded border border-[var(--forum-border)]">
        <div className="forum-panel-head px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--forum-text)]">
          Thống kê nhanh
        </div>
        <div className="space-y-2 border-t border-[var(--forum-border)] bg-[var(--forum-bg)] px-3 py-2.5 text-[var(--forum-muted)]">
          <p>
            <span className="font-mono text-[var(--forum-text)]">12.840</span>{" "}
            chủ đề
          </p>
          <p>
            <span className="font-mono text-[var(--forum-text)]">902.100</span>{" "}
            bài viết
          </p>
          <p>
            <span className="font-mono text-[var(--forum-accent-text)]">1.234</span>{" "}
            thành viên
          </p>
          <p className="border-t border-[var(--forum-border)] pt-2 text-[11px]">
            Đang xem: <span className="text-[var(--forum-text)]">mock</span>
          </p>
        </div>
      </div>
      <div className="forum-panel overflow-hidden rounded border border-[var(--forum-border)]">
        <div className="forum-panel-head px-3 py-2 text-[11px] font-semibold uppercase tracking-wide">
          Ghi chú dev
        </div>
        <p className="border-t border-[var(--forum-border)] bg-[var(--forum-bg)] px-3 py-2.5 leading-relaxed text-[var(--forum-muted)]">
          Số liệu cứng trong component — đổi sang fetch từ{" "}
          <code className="rounded bg-[var(--forum-panel)] px-1 font-mono text-[10px]">
            GET /stats
          </code>{" "}
          khi có API.
        </p>
      </div>
    </aside>
  );
}
