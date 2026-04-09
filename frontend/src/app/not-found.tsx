import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-display text-2xl font-bold text-[var(--forum-text)]">
        404
      </h1>
      <p className="text-[13px] text-[var(--forum-muted)]">
        Không tìm thấy trang hoặc nội dung bạn yêu cầu.
      </p>
      <Link
        href="/"
        className="rounded bg-[var(--forum-accent)] px-4 py-2 text-[13px] font-semibold text-[var(--forum-accent-contrast)] hover:opacity-90"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
