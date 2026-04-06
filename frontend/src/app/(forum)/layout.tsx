import { SiteFooter } from "@/components/forum/site-footer";
import { SiteHeader } from "@/components/forum/site-header";
import { SidebarStats } from "@/components/forum/sidebar-stats";

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-[var(--forum-bg)] text-[var(--forum-text)]">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1100px] flex-1 gap-6 px-3 py-5">
        <main className="min-w-0 flex-1">{children}</main>
        <div className="hidden w-[220px] shrink-0 lg:block">
          <SidebarStats />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
