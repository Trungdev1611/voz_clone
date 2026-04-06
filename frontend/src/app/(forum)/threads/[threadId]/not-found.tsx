import Link from "next/link";

export default function ThreadNotFound() {
  return (
    <div className="rounded border border-[var(--forum-border)] bg-[var(--forum-panel)] px-4 py-10 text-center">
      <h1 className="text-lg font-semibold text-[var(--forum-text)]">
        Không tìm thấy chủ đề
      </h1>
      <p className="mt-2 text-[13px] text-[var(--forum-muted)]">
        ID chủ đề không hợp lệ hoặc chưa có trong mock.
      </p>
      <Link
        href="/"
        className="mt-4 inline-block text-[var(--forum-link)] hover:underline"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
