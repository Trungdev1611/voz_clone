import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
  footerLink,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerLink?: { href: string; label: string; hint: string };
}) {
  return (
    <div className="mx-auto w-full max-w-[420px]">
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--forum-accent)]">
          VOZ CLONE
        </h1>
        <p className="mt-2 text-lg font-semibold text-[var(--forum-text)]">
          {title}
        </p>
        {subtitle ? (
          <p className="mt-1 text-[13px] text-[var(--forum-muted)]">
            {subtitle}
          </p>
        ) : null}
      </div>
      <div className="overflow-hidden rounded border border-[var(--forum-border)] bg-[var(--forum-panel)] shadow-sm">
        <div className="forum-panel-head px-4 py-2.5 text-[12px] font-semibold text-[var(--forum-text)]">
          {title}
        </div>
        <div className="border-t border-[var(--forum-border)] bg-[var(--forum-bg)] p-4">
          {children}
        </div>
      </div>
      {footerLink ? (
        <p className="mt-4 text-center text-[13px] text-[var(--forum-muted)]">
          {footerLink.hint}{" "}
          <Link
            href={footerLink.href}
            className="font-medium text-[var(--forum-link)] hover:text-[var(--forum-link-hover)] hover:underline"
          >
            {footerLink.label}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
