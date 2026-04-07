"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { apiClient } from "@/lib/api-client";
import { toErrorMessage } from "@/hooks/helper";

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  role: string;
};

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
};

export type LoginInput = {
  usernameOrEmail: string;
  password: string;
};

export const authQueryKeys = {
  me: ["auth", "me"] as const,
};



export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (payload: RegisterInput) => {
      const { data } = await apiClient.post("/v1/auth/register", payload);
      return data?.data ?? data;
    },
    onError: (error) => {
      console.error("[register error]", toErrorMessage(error));
    },
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (payload: LoginInput) => {
      const { data } = await apiClient.post("/v1/auth/login", payload);
      return data?.data ?? data;
    },
    onError: (error) => {
      console.error("[login error]", toErrorMessage(error));
    },
  });
}

export function useMeQuery() {
  return useQuery<AuthUser | null>({
    queryKey: authQueryKeys.me,
    queryFn: async () => {
      try {
        const { data } = await apiClient.get("/v1/auth/me");
        return (data?.data?.user ?? null) as AuthUser | null;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post("/v1/auth/logout");
      return data?.message ?? "Đăng xuất thành công";
    },
    onSuccess: () => {
      queryClient.setQueryData(authQueryKeys.me, null);
      void queryClient.invalidateQueries({ queryKey: authQueryKeys.me });
    },
  });
}

