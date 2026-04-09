"use client";

import { Breadcrumb } from "@/components/common/breadcrumb";
import { ForumThreadsContent } from "./forum-threads-content";
import { useForumByKeyQuery } from "@/hooks/categories/use-category";
import { useMeQuery } from "@/hooks/auth/use-auth";
import {
  useCreateThreadMutation,
  useThreadListQuery,
  type ThreadApiItem,
} from "@/hooks/thread/use-thread";
import { useHandleQueryErrors } from "@/hooks/use-not-found-on-404";
import type { ThreadListRow } from "@/types/thread";
import type { NewThreadDraft } from "./new-thread-composer";

export function ForumThreadsPageContent({ forumKey }: { forumKey: string }) {
  const {
    data: forum,
    isLoading: isForumLoading,
    error: forumError,
  } = useForumByKeyQuery(forumKey);
  const { data: me } = useMeQuery();
  const categorySlug = forum?.slug;
  const {
    data: threadRows = [],
    error: threadListError,
    refetch: refetchThreadList,
  } = useThreadListQuery(categorySlug, { page: 1, per_page: 20 });
  const createThreadMutation = useCreateThreadMutation(categorySlug);
  useHandleQueryErrors(forumError, threadListError);

  const mapApiThreadToView = (thread: ThreadApiItem): ThreadListRow => ({
    id: String(thread.id),
    title: thread.title,
    author: `user#${thread.authorId}`,
    replyCount: thread.repliesCount ?? 0,
    viewCount: thread.views ?? 0,
    lastPostAt: thread.lastPostAt
      ? new Date(thread.lastPostAt).toLocaleString("vi-VN")
      : "—",
    lastPostBy: `user#${thread.lastUserId ?? thread.authorId}`,
    isPinned: false,
    isLocked: false,
  });

  if (isForumLoading) {
    return (
      <p className="text-[13px] text-[var(--forum-muted)]">Đang tải box…</p>
    );
  }

  if (!forum) {
    return (
      <p className="text-[13px] text-[var(--forum-muted)]">
        Không thể tải thông tin box.
      </p>
    );
  }

  const currentForum = forum;
  const threadsFromApi = threadRows.map(mapApiThreadToView);

  async function handleCreateThread(draft: NewThreadDraft) {
    if (!me?.id) {
      throw new Error("Bạn cần đăng nhập để tạo chủ đề.");
    }

    await createThreadMutation.mutateAsync({
      title: draft.title,
      content: draft.body || "Bài viết mới.",
      categorySlug: currentForum.slug,
      authorId: me.id,
    });

    await refetchThreadList();
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: currentForum.name },
        ]}
      />
      <ForumThreadsContent
        forum={{ id: String(currentForum.id), name: currentForum.name }}
        threads={threadsFromApi}
        onCreate={handleCreateThread}
        isCreating={createThreadMutation.isPending}
      />
    </>
  );
}
