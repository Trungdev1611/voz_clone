import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav
      className="mb-3 flex flex-wrap items-center gap-x-1 gap-y-1 text-[12px] text-[var(--forum-muted)]"
      aria-label="Breadcrumb"
    >
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-1">
          {i > 0 && (
            <span className="text-[var(--forum-border-strong)]" aria-hidden>
              ›
            </span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-[var(--forum-link)] hover:text-[var(--forum-link-hover)] hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--forum-text)]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
