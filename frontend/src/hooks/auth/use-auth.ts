"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { apiClient } from "@/lib/api-client";
import { toErrorMessage } from "@/hooks/helper";
import { authQueryKeys } from "./authQueryKey";

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

export type ResendVerificationInput = {
  email: string;
};




export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (payload: RegisterInput) => {
      const { data } = await apiClient.post("/v1/auth/register", payload);
      return data;
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
      return data;
    },
    onError: (error) => {
      console.error("[login error]", toErrorMessage(error));
    },
  });
}

export function useResendVerificationMutation() {
  return useMutation({
    mutationFn: async (payload: ResendVerificationInput) => {
      const { data } = await apiClient.post("/v1/auth/resend-verification", payload);
      return data;
    },
    onError: (error) => {
      console.error("[resend verification error]", toErrorMessage(error));
    },
  });
}

export function useMeQuery() {
  return useQuery<AuthUser | null>({
    queryKey: authQueryKeys.me,
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<{ user: AuthUser }>("/v1/auth/me");
        return (data?.user ?? null) as AuthUser | null;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 5*60*1000, //5 minutes, avoid calling api too often
    gcTime: 10*60*1000, //10 minutes, avoid calling api too often
    refetchOnWindowFocus: false,
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post<{ message: string }>(
        "/v1/auth/logout",
      );
      return data?.message ?? "Đăng xuất thành công";
    },
    onSuccess: () => {
      queryClient.setQueryData(authQueryKeys.me, null);
      void queryClient.invalidateQueries({ queryKey: authQueryKeys.me });
    },
  });
}

