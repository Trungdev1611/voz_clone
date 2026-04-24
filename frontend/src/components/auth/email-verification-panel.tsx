"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useResendVerificationMutation } from "@/hooks/auth/use-auth";
import { toErrorMessage } from "@/hooks/helper";

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function EmailVerificationPanel() {
  const searchParams = useSearchParams();
  const email = (searchParams.get("email") ?? "").trim();
  const sentAtQuery = Number(searchParams.get("sentAt"));
  const initialSentAt = Number.isFinite(sentAtQuery) ? sentAtQuery : Date.now() - FIFTEEN_MINUTES_MS;

  const [lastSentAt, setLastSentAt] = useState<number>(initialSentAt);
  const [now, setNow] = useState<number>(Date.now());
  const resendMutation = useResendVerificationMutation();
  const mailhogUrl = process.env.NEXT_PUBLIC_MAILHOG_URL ?? "http://localhost:8025";

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remainingMs = Math.max(0, lastSentAt + FIFTEEN_MINUTES_MS - now);
  const canResend = remainingMs === 0 && email.length > 0;

  async function handleResend() {
    if (!email) {
      toast.error("Thiếu email để gửi lại link xác thực.");
      return;
    }
    try {
      const result = await resendMutation.mutateAsync({ email });
      toast.success(result?.message ?? "Đã gửi lại email xác thực.");
      setLastSentAt(Date.now());
      setNow(Date.now());
    } catch (error) {
      toast.error(toErrorMessage(error));
    }
  }

  return (
    <div className="space-y-4 text-[13px] text-[var(--forum-text)]">
      <div className="rounded border border-[var(--forum-border)] bg-[var(--forum-panel)] px-3 py-2.5">
        <p>
          Tài khoản đã được tạo. Chúng tôi đã gửi email xác thực tới{" "}
          <span className="font-semibold">{email || "email bạn vừa đăng ký"}</span>.
        </p>
        <p className="mt-2 text-[var(--forum-muted)]">
          Link xác thực có hiệu lực 15 phút. Nếu quá 24 giờ chưa xác thực, tài khoản chưa kích hoạt có thể bị xóa.
        </p>
      </div>

      <div className="rounded border border-[var(--forum-border)] bg-[var(--forum-bg)] px-3 py-2.5">
        <p className="font-medium">Chưa thấy email?</p>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-[var(--forum-muted)]">
          <li>Kiểm tra mục Spam/Junk.</li>
          <li>Trong môi trường dev, mở MailHog để kiểm tra email test.</li>
        </ul>
        <p className="mt-2">
          <a
            href={mailhogUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[var(--forum-link)] hover:underline"
          >
            Mở MailHog
          </a>
        </p>
      </div>

      <div className="rounded border border-[var(--forum-border)] bg-[var(--forum-bg)] px-3 py-2.5">
        {canResend ? (
          <p className="text-[var(--forum-muted)]">Link đã hết hạn, bạn có thể gửi lại email xác thực.</p>
        ) : (
          <p className="text-[var(--forum-muted)]">
            Có thể gửi lại email sau: <span className="font-semibold text-[var(--forum-text)]">{formatRemaining(remainingMs)}</span>
          </p>
        )}
        <button
          type="button"
          onClick={handleResend}
          disabled={
            // !canResend || 
            resendMutation.isPending}
          className="mt-3 w-full rounded bg-[var(--forum-accent)] py-2 text-[13px] font-semibold text-[var(--forum-accent-contrast)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resendMutation.isPending ? "Đang gửi lại..." : "Gửi lại email xác thực"}
        </button>
      </div>

      <p className="text-center text-[12px] text-[var(--forum-muted)]">
        Đã xác thực xong?{" "}
        <Link
          href="/dang-nhap"
          className="font-medium text-[var(--forum-link)] hover:text-[var(--forum-link-hover)] hover:underline"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
