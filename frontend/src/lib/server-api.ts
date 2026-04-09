import type { ThreadDetail } from "@/types/thread";

function getApiOrigin(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
}

function unwrapEnvelope(json: unknown): unknown {
  if (
    json &&
    typeof json === "object" &&
    (json as Record<string, unknown>).success === true &&
    "data" in (json as Record<string, unknown>)
  ) {
    return (json as { data: unknown }).data;
  }
  return json;
}

/**
 * Fetch JSON từ backend (server-side), unwrap envelope giống `apiClient`.
 * 404 → `null`. Lỗi khác → throw.
 */
export async function fetchThreadById(
  threadId: string,
  init?: RequestInit & { cookieHeader?: string | null },
): Promise<ThreadDetail | null> {
  const id = Number.parseInt(threadId, 10);
  if (!Number.isFinite(id) || id < 1) {
    return null;
  }

  const { cookieHeader, ...rest } = init ?? {};

  const url = `${getApiOrigin()}/api/v1/thread/${id}`;
  const res = await fetch(url, {
    ...rest,
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...rest.headers,
    },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Thread API ${res.status}: ${text.slice(0, 200)}`,
    );
  }

  const json: unknown = await res.json();
  const data = unwrapEnvelope(json) as ThreadDetail;
  return data ?? null;
}
