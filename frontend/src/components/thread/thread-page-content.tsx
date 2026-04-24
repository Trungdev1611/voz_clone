"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import axios from "axios";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { ThreadView } from "@/components/thread/thread-view";
import { useThreadDetailQuery } from "@/hooks/thread/use-thread";
import type {
  ThreadDetail,
  ThreadPostDisplay,
  ThreadViewHeader,
} from "@/types/thread";

function mapDetailToView(detail: ThreadDetail): {
  forumSlug: string;
  forumName: string;
  threadHeader: ThreadViewHeader;
  openerPost: ThreadPostDisplay;
} {
  const forumSlug = detail.category?.slug ?? String(detail.categoryId);
  const forumName = detail.category?.name ?? "Diễn đàn";
  const authorId = detail.author?.id ?? detail.authorId ?? 0;
  const authorName =
    detail.author?.username ??
    (authorId > 0 ? `user#${authorId}` : "Thành viên ẩn danh");

  const threadHeader: ThreadViewHeader = {
    title: detail.title,
    replyCount: detail.repliesCount ?? 0,
    viewCount: detail.views ?? 0,
    isPinned: false,
    isLocked: false,
  };

  const openerPost: ThreadPostDisplay = {
    id: `op-${detail.id}`,
    author: authorName,
    userTitle: "Thành viên",
    joinDate: "—",
    postCount: 0,
    avatarHue: Math.abs(authorId * 37) % 360,
    body: detail.content,
    createdAt: detail.lastPostAt
      ? new Date(detail.lastPostAt).toLocaleString("vi-VN")
      : "—",
    index: 1,
  };

  return { forumSlug, forumName, threadHeader, openerPost };
}

function ThreadPageSkeleton() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Chủ đề" },
        ]}
      />
      <div className="mb-3 h-4 w-40 animate-pulse rounded bg-[var(--forum-border)]" />
      <section className="overflow-hidden rounded border border-[var(--forum-border)]">
        <div className="forum-category-head px-3 py-3">
          <div className="h-5 w-3/4 max-w-md animate-pulse rounded bg-[var(--forum-border)]" />
          <div className="mt-2 h-3 w-48 animate-pulse rounded bg-[var(--forum-border)]" />
        </div>
        <div className="border-t border-[var(--forum-border)] px-3 py-8">
          <div className="mx-auto h-24 max-w-2xl animate-pulse rounded bg-[var(--forum-border)]" />
        </div>
      </section>
    </>
  );
}

export function ThreadPageContent({ threadId }: { threadId: string }) {
  const id = Number.parseInt(threadId, 10);
  const validId = Number.isFinite(id) && id >= 1;
  const { data, isPending, isError, error, refetch, isFetching } =
    useThreadDetailQuery(threadId);

  if (!validId) {
    notFound();
  }

  if (isError && axios.isAxiosError(error) && error.response?.status === 404) {
    notFound();
  }

  if (isPending || (isFetching && !data)) {
    return <ThreadPageSkeleton />;
  }

  if (isError || !data) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Chủ đề" },
          ]}
        />
        <p className="mt-4 text-[13px] text-[var(--forum-muted)]">
          Không tải được chủ đề.{" "}
          <button
            type="button"
            className="text-[var(--forum-link)] underline"
            onClick={() => void refetch()}
          >
            Thử lại
          </button>
        </p>
      </>
    );
  }

  const { forumSlug, forumName, threadHeader, openerPost } =
    mapDetailToView(data);

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
