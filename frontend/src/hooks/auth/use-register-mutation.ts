"use client";

import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import { toErrorMessage } from "../helper";

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
};


export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (payload: RegisterInput) => {
      const { data } = await apiClient.post("/auth/register", payload);
      return data;
    },
    onError: (error) => {
      console.error("[register error]", toErrorMessage(error));
    },
  });
}



