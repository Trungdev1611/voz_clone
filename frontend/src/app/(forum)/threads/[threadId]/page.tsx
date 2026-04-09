import { notFound } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { ThreadView } from "@/components/thread/thread-view";
import { fetchThreadById } from "@/lib/server-api";
import type { ThreadPostDisplay, ThreadViewHeader } from "@/types/thread";

type Props = { params: Promise<{ threadId: string }> };

export default async function ThreadPage({ params }: Props) {
  const { threadId } = await params;
  const h = await headers();
  const detail = await fetchThreadById(threadId, {
    cookieHeader: h.get("cookie"),
  });

  if (!detail) {
    notFound();
  }

  const forumSlug = detail.category?.slug ?? String(detail.categoryId);
  const forumName = detail.category?.name ?? "Diễn đàn";

  const threadHeader: ThreadViewHeader = {
    title: detail.title,
    replyCount: detail.repliesCount ?? 0,
    viewCount: detail.views ?? 0,
    isPinned: false,
    isLocked: false,
  };

  const openerPost: ThreadPostDisplay = {
    id: `op-${detail.id}`,
    author: `user#${detail.authorId}`,
    userTitle: "Thành viên",
    joinDate: "—",
    postCount: 0,
    avatarHue: Math.abs(detail.authorId * 37) % 360,
    body: detail.content,
    createdAt: detail.lastPostAt
      ? new Date(detail.lastPostAt).toLocaleString("vi-VN")
      : "—",
    index: 1,
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: forumName, href: `/forums/${forumSlug}` },
          { label: "Chủ đề" },
        ]}
      />
      <div className="mb-3 text-[12px]">
        <Link
          href={`/forums/${forumSlug}`}
          className="text-[var(--forum-link)] hover:underline"
        >
          ← Quay lại danh sách chủ đề
        </Link>
      </div>
      <ThreadView thread={threadHeader} posts={[openerPost]} />
    </>
  );
}
