"use client";
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Category, ForumRow } from "./type";
import { categoryQueryKeys } from "./categoryQueryKey";

export function useCategoryQuery() {
  return useQuery<Category[]>({
    queryKey: categoryQueryKeys.categoryList,
    queryFn: async () => {
      const { data } = await apiClient.get<Category[]>("/v1/categorie-forum");
      return Array.isArray(data) ? data : [];
    },
  });
}

export function useForumByKeyQuery(forumKey: string) {
  return useQuery<ForumRow>({
    queryKey: categoryQueryKeys.forumByKey(forumKey),
    enabled: Boolean(forumKey),
    queryFn: async () => {
      const { data } = await apiClient.get<ForumRow>(
        `/v1/categorie-forum/${forumKey}`,
      );
      return data;
    },
  });
}