"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRegisterMutation } from "@/hooks/auth/use-auth";
import { toErrorMessage } from "@/hooks/helper";

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const registerMutation = useRegisterMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (password !== confirm) {
      setFormError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (!agree) {
      setFormError("Vui lòng đồng ý nội quy.");
      return;
    }
    try {
      const result = await registerMutation.mutateAsync({
        username,
        email,
        password,
      });
      toast.success(result?.message ?? "Đăng ký thành công");
      router.push("/dang-nhap");
    } catch (error) {
      setFormError(toErrorMessage(error));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError ? (
        <p
          className="rounded border border-[var(--forum-pill-lock)] bg-[var(--forum-pill-lock)] px-3 py-2 text-[12px] text-[var(--forum-pill-lock-text)]"
          role="alert"
        >
          {formError}
        </p>
      ) : null}
      <div>
        <label
          htmlFor="reg-username"
          className="mb-1 block text-[12px] font-medium text-[var(--forum-text)]"
        >
          Tên đăng nhập
        </label>
        <input
          id="reg-username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="forum-input w-full rounded border border-[var(--forum-border)] bg-[var(--forum-panel)] px-3 py-2 text-[13px] text-[var(--forum-text)] placeholder:text-[var(--forum-muted)]"
          placeholder="Chỉ chữ, số, gạch dưới"
          required
          minLength={3}
          maxLength={32}
          pattern="[a-zA-Z0-9_]+"
          title="Chữ cái, số và gạch dưới"
        />
      </div>
      <div>
        <label
          htmlFor="reg-email"
          className="mb-1 block text-[12px] font-medium text-[var(--forum-text)]"
        >
          Email
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="forum-input w-full rounded border border-[var(--forum-border)] bg-[var(--forum-panel)] px-3 py-2 text-[13px] text-[var(--forum-text)]"
          placeholder="ban@email.com"
          required
        />
      </div>
      <div>
        <label
          htmlFor="reg-password"
          className="mb-1 block text-[12px] font-medium text-[var(--forum-text)]"
        >
          Mật khẩu
        </label>
        <input
          id="reg-password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="forum-input w-full rounded border border-[var(--forum-border)] bg-[var(--forum-panel)] px-3 py-2 text-[13px] text-[var(--forum-text)]"
          placeholder="Tối thiểu 8 ký tự"
          required
          minLength={8}
        />
      </div>
      <div>
        <label
          htmlFor="reg-confirm"
          className="mb-1 block text-[12px] font-medium text-[var(--forum-text)]"
        >
          Nhập lại mật khẩu
        </label>
        <input
          id="reg-confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="forum-input w-full rounded border border-[var(--forum-border)] bg-[var(--forum-panel)] px-3 py-2 text-[13px] text-[var(--forum-text)]"
          required
          minLength={8}
        />
      </div>
      <label className="flex cursor-pointer items-start gap-2 text-[12px] text-[var(--forum-muted)]">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-0.5 rounded border-[var(--forum-border)]"
        />
        <span>
          Tôi đồng ý{" "}
          <span className="text-[var(--forum-link)]">nội quy diễn đàn</span>{" "}
          (mock — nối trang nội quy sau).
        </span>
      </label>
      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full rounded bg-[var(--forum-accent)] py-2.5 text-[14px] font-semibold text-[var(--forum-accent-contrast)] transition-opacity hover:opacity-90"
      >
        {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
      </button>
    </form>
  );
}
