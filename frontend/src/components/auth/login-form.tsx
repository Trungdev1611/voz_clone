"use client";

import { useState } from "react";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Nối API: POST /auth/login
    console.info("[mock login]", { username, remember });
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
        className="w-full rounded bg-[var(--forum-accent)] py-2.5 text-[14px] font-semibold text-[var(--forum-accent-contrast)] transition-opacity hover:opacity-90"
      >
        Đăng nhập
      </button>
      <p className="text-center text-[11px] text-[var(--forum-muted)]">
        Gửi form chỉ log mock trong console — chưa gọi backend.
      </p>
    </form>
  );
}
