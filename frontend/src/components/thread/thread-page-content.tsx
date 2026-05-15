"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { ThreadView } from "@/components/thread/thread-view";
import {
  useCommentListQuery,
  useCreateCommentMutation,
} from "@/hooks/comment/use-comment";
import { useThreadDetailQuery } from "@/hooks/thread/use-thread";
import type {
  ThreadComment,
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

function mapCommentToPost(comment: ThreadComment, index: number): ThreadPostDisplay {
  const authorId = comment.user?.id ?? comment.userId;
  const authorName =
    comment.user?.username ??
    (authorId ? `user#${authorId}` : "Thành viên ẩn danh");

  return {
    id: `c-${comment.id}`,
    author: authorName,
    userTitle: "Thành viên",
    joinDate: "—",
    postCount: 0,
    avatarHue: Math.abs((authorId || 0) * 37) % 360,
    body: comment.content,
    createdAt: comment.createdAt
      ? new Date(comment.createdAt).toLocaleString("vi-VN")
      : "—",
    index,
  };
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
  const [commentPage, setCommentPage] = useState(1);
  const COMMENT_PER_PAGE = 20;
  const {
    data: commentPageData,
    isFetching: isCommentsFetching,
    refetch: refetchComments,
  } = useCommentListQuery(threadId, {
    page: commentPage,
    per_page: COMMENT_PER_PAGE,
  });
  const createCommentMutation = useCreateCommentMutation(threadId);
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
  const comments = commentPageData?.items ?? [];
  const commentPosts = comments.map((comment, idx) =>
    mapCommentToPost(
      comment,
      (commentPage - 1) * COMMENT_PER_PAGE + idx + 2,
    ),
  );
  const posts = [openerPost, ...commentPosts];

  async function handleSubmitReply(content: string) {
    await createCommentMutation.mutateAsync({ content });
    setCommentPage(1);
    await Promise.all([refetchComments(), refetch()]);
  }

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
      <ThreadView
        thread={threadHeader}
        posts={posts}
        onSubmitReply={handleSubmitReply}
        isSubmittingReply={createCommentMutation.isPending || isCommentsFetching}
      />
      {(commentPageData?.total_pages ?? 1) > 1 && (
        <div className="mt-3 flex items-center justify-end gap-2 text-[12px]">
          <button
            type="button"
            disabled={commentPage <= 1}
            onClick={() => setCommentPage((p) => Math.max(1, p - 1))}
            className="rounded border border-[var(--forum-border)] px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Trước
          </button>
          <span className="text-[var(--forum-muted)]">
            Trang {commentPageData?.page ?? commentPage}/
            {commentPageData?.total_pages ?? 1}
          </span>
          <button
            type="button"
            disabled={commentPage >= (commentPageData?.total_pages ?? 1)}
            onClick={() =>
              setCommentPage((p) =>
                Math.min(commentPageData?.total_pages ?? p, p + 1),
              )
            }
            className="rounded border border-[var(--forum-border)] px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </>
  );
}
