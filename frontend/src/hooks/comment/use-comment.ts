"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ThreadComment, ThreadCommentList } from "@/types/thread";

const commentQueryKeys = {
  all: ["comment"] as const,
  listByThreadId: (threadId: number, page: number, per_page: number) =>
    [...commentQueryKeys.all, "list", threadId, page, per_page] as const,
};

export function useCommentListQuery(
  threadIdParam: string,
  opts?: { page?: number; per_page?: number },
) {
  const threadId = Number.parseInt(threadIdParam, 10);
  const valid = Number.isFinite(threadId) && threadId >= 1;
  const page = opts?.page ?? 1;
  const per_page = opts?.per_page ?? 20;

  return useQuery<ThreadCommentList>({
    queryKey: valid
      ? commentQueryKeys.listByThreadId(threadId, page, per_page)
      : [...commentQueryKeys.all, "list", "invalid"],
    enabled: valid,
    queryFn: async () => {
      const { data } = await apiClient.get<ThreadCommentList>("/v1/comments", {
        params: { threadId, page, per_page },
      });
      return {
        items: Array.isArray(data?.items) ? data.items : [],
        page: Number(data?.page ?? page),
        per_page: Number(data?.per_page ?? per_page),
        total: Number(data?.total ?? 0),
        total_pages: Number(data?.total_pages ?? 1),
      };
    },
  });
}

export function useCreateCommentMutation(threadIdParam: string) {
  const queryClient = useQueryClient();
  const threadId = Number.parseInt(threadIdParam, 10);

  return useMutation({
    mutationFn: async (payload: { content: string }) => {
      const { data } = await apiClient.post<ThreadComment>("/v1/comments", {
        threadId,
        content: payload.content,
      });
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...commentQueryKeys.all, "list", threadId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["thread", "detail", threadId],
      });
    },
  });
}

export function useUpdateCommentMutation(threadId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { commentId: number; content: string }) => {
      const { data } = await apiClient.patch<ThreadComment>(
        `/v1/comments/${payload.commentId}`,
        {
          content: payload.content,
        },
      );
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...commentQueryKeys.all, "list", threadId],
      });
    },
  });
}

export function useDeleteCommentMutation(threadId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: number) => {
      const { data } = await apiClient.delete<{ deleted: boolean }>(
        `/v1/comments/${commentId}`,
      );
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...commentQueryKeys.all, "list", threadId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["thread", "detail", threadId],
      });
    },
  });
}
