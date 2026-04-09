export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--forum-border)] bg-[var(--forum-panel)] py-4 text-center text-[11px] text-[var(--forum-muted)]">
      <div className="mx-auto max-w-[1100px] px-3">
        <p>
          Giao diện mock —{" "}
          <span className="font-mono text-[var(--forum-accent-text)]">
            Next.js
          </span>{" "}
          · dữ liệu tĩnh, chờ API.
        </p>
      </div>
    </footer>
  );
}
