"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toErrorMessage } from "../helper";

export type LoginInput = {
  usernameOrEmail: string;
  password: string;
};

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (payload: LoginInput) => {
      const { data } = await apiClient.post("/auth/login", payload);
      return data;
    },
    onError: (error) => {
      console.error("[login error]", toErrorMessage(error));
    },
  });
}

