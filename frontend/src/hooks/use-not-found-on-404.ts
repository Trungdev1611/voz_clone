"use client";

import { notFound } from "next/navigation";
import { isApiNotFoundError } from "@/lib/http-error";

/**
 * Xử lý lỗi tập trung cho page:
 * - Có bất kỳ 404 API => `notFound()`
 * - Có lỗi khác 404 => throw để lên error boundary
 */
export function useHandleQueryErrors(...errors: unknown[]): void {
  const firstError = errors.find(Boolean);
  if (!firstError) {
    return;
  }

  if (errors.some(isApiNotFoundError)) {
    notFound();
  }

  throw firstError;
}

