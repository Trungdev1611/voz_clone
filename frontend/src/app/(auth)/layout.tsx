import { SiteFooter } from "@/components/forum/site-footer";
import { SiteHeader } from "@/components/forum/site-header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-[var(--forum-bg)] text-[var(--forum-text)]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col px-3 py-8">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
