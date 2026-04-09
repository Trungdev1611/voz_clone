"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { threadQueryKeys } from "./threadQueryKey";

export type ThreadApiItem = {
  id: number;
  title: string;
  content: string;
  slug: string;
  authorId: number;
  categoryId: number;
  views: number;
  repliesCount: number;
  lastPostAt: string;
  lastUserId: number;
};

export type CreateThreadInput = {
  title: string;
  content: string;
  categorySlug: string;
  authorId: number;
};

export function useThreadListQuery(
  categorySlug?: string,
  opts?: { page?: number; per_page?: number; search?: string },
) {
  const page = opts?.page ?? 1;
  const per_page = opts?.per_page ?? 20;
  const search = opts?.search;

  return useQuery<ThreadApiItem[]>({
    queryKey:
      categorySlug && page && per_page
        ? [
            ...threadQueryKeys.listByCategorySlug(categorySlug),
            page,
            per_page,
            search,
          ]
        : [...threadQueryKeys.all, "unknown"],
    enabled: typeof categorySlug === "string" && categorySlug.length > 0,
    queryFn: async () => {
      const { data } = await apiClient.get<ThreadApiItem[]>("/v1/thread", {
        params: { categorySlug, page, per_page, search },
      });
      return Array.isArray(data) ? data : [];
    },
  });
}

export function useCreateThreadMutation(categorySlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateThreadInput) => {
      const { data } = await apiClient.post<ThreadApiItem>("/v1/thread", payload);
      return data;
    },
    onSuccess: async () => {
      if (typeof categorySlug === "string" && categorySlug.length > 0) {
        await queryClient.invalidateQueries({
          queryKey: threadQueryKeys.listByCategorySlug(categorySlug),
        });
      }
    },
  });
}

