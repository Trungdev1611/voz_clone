import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="forum-header border-b border-[var(--forum-border)]">
      <div className="forum-topbar text-[11px] text-[var(--forum-muted)]">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-2 px-3 py-1.5">
          <nav className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="text-[var(--forum-accent-text)]">VOZ CLONE</span>
            <Link href="/" className="hover:text-[var(--forum-link-hover)]">
              Trang chủ
            </Link>
            <span className="opacity-50">FAQ</span>
            <span className="opacity-50">Nội quy</span>
          </nav>
          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span>Chào, Khách</span>
            <Link
              href="/dang-nhap"
              className="inline-block rounded border border-[var(--forum-border)] bg-[var(--forum-panel)] px-2 py-0.5 hover:border-[var(--forum-accent)]"
            >
              Đăng nhập
            </Link>
            <Link
              href="/dang-ky"
              className="inline-block rounded bg-[var(--forum-accent)] px-2 py-0.5 font-sans text-[11px] font-medium text-[var(--forum-accent-contrast)] hover:opacity-90"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
      <div className="forum-brand border-b border-[var(--forum-border)] bg-[var(--forum-panel)]">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="group flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold tracking-tight text-[var(--forum-accent)] group-hover:opacity-90">
              VOZ
            </span>
            <span className="text-sm font-medium text-[var(--forum-muted)]">
              CLONE
            </span>
          </Link>
          <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor="forum-search">
              Tìm kiếm
            </label>
            <input
              id="forum-search"
              type="search"
              placeholder="Tìm trong diễn đàn… (nối API sau)"
              className="forum-input w-full flex-1 rounded border border-[var(--forum-border)] bg-[var(--forum-bg)] px-3 py-2 text-sm text-[var(--forum-text)] placeholder:text-[var(--forum-muted)]"
              disabled
            />
          </div>
        </div>
      </div>
    </header>
  );
}
