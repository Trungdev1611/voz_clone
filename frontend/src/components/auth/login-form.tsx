"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { toErrorMessage } from "@/hooks/helper";
import { useLoginMutation } from "@/hooks/auth/use-auth";
import { authQueryKeys } from "@/hooks/auth/authQueryKey";

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const loginMutation = useLoginMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await loginMutation.mutateAsync({
        usernameOrEmail: username,
        password,
      });
      toast.success(result?.message ?? "Đăng nhập thành công");
      queryClient.setQueryData(authQueryKeys.me, result?.user ?? null); //set cache cho data user ngay, tránh hiện tượng đã login nhưng trang vẫn nhận là chưa login do cache cũ. Cũng có thể dùng queryClient.invalidateQueries để xóa cache cũ, nhưng cách này sẽ
      
      //gọi lại API /auth/me để lấy data user mới, đánh dấu cái setQuery trên hết hạn, sau đó sang màn home có header ở dưới api k bị gọi lại vì data mới fetch ở dưới trùng key
      //việc set invalidateQueries sẽ khiến data mới trên tất cả components dùng auth/me authQueryKeys.me
      void queryClient.invalidateQueries({ queryKey: authQueryKeys.me });
      router.push("/");
    } catch (error) {
      toast.error(toErrorMessage(error));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="login-username"
          className="mb-1 block text-[12px] font-medium text-[var(--forum-text)]"
        >
          Tên đăng nhập hoặc email
        </label>
        <input
          id="login-username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="forum-input w-full rounded border border-[var(--forum-border)] bg-[var(--forum-panel)] px-3 py-2 text-[13px] text-[var(--forum-text)] placeholder:text-[var(--forum-muted)]"
          placeholder="vd: thanh_vien"
          required
        />
      </div>
      <div>
        <label
          htmlFor="login-password"
          className="mb-1 block text-[12px] font-medium text-[var(--forum-text)]"
        >
          Mật khẩu
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="forum-input w-full rounded border border-[var(--forum-border)] bg-[var(--forum-panel)] px-3 py-2 text-[13px] text-[var(--forum-text)]"
          placeholder="••••••••"
          required
          minLength={6}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
        <label className="flex cursor-pointer items-center gap-2 text-[var(--forum-muted)]">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="rounded border-[var(--forum-border)]"
          />
          Duy trì đăng nhập
        </label>
        <button
          type="button"
          className="text-[var(--forum-link)] hover:underline"
          disabled
          title="Nối API sau"
        >
          Quên mật khẩu?
        </button>
      </div>
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full rounded bg-[var(--forum-accent)] py-2.5 text-[14px] font-semibold text-[var(--forum-accent-contrast)] transition-opacity hover:opacity-90"
      >
        {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}
