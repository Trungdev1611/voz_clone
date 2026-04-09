"use client";

import axios, { type AxiosResponse } from "axios";

type SuccessEnvelope = {
  success: true;
  message: string;
  data: unknown;
};

function isSuccessEnvelope(body: unknown): body is SuccessEnvelope {
  return (
    !!body &&
    typeof body === "object" &&
    (body as Record<string, unknown>).success === true &&
    "data" in (body as Record<string, unknown>)
  );
}

/**
 * Unwraps Nest `SuccessResponseInterceptor` body: `{ success, message, data }`
 * → `data` (mảng / primitive giữ nguyên).
 * Với `data` là object: gộp thêm `message` từ envelope (toast, logout, v.v.).
 * Với `data` rỗng `{}`: trả `{ message }` để không mất nội dung (vd. đăng xuất).
 */
function unwrapApiBody(body: unknown): unknown {
  if (!isSuccessEnvelope(body)) {
    return body;
  }

  const { message, data: inner } = body;

  if (inner === null || inner === undefined) {
    return typeof message === "string" ? { message } : inner;
  }

  if (Array.isArray(inner)) {
    return inner;
  }

  if (typeof inner === "object") {
    const record = inner as Record<string, unknown>;
    const empty = Object.keys(record).length === 0;
    if (empty && typeof message === "string") {
      return { message };
    }
    if (typeof message === "string") {
      return { ...record, message };
    }
    return inner;
  }

  return inner;
}

export const apiClient = axios.create({
  baseURL:
    (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000") + "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use((response: AxiosResponse) => {
  response.data = unwrapApiBody(response.data);
  return response;
});
