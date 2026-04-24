import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { EmailVerificationPanel } from "@/components/auth/email-verification-panel";

export const metadata: Metadata = {
  title: "Email verification",
};

export default function VerifyEmailPage() {
  return (
    <AuthShell
      title="Xác thực email"
      subtitle="Vui lòng xác thực email trước khi đăng nhập."
      footerLink={{
        hint: "Muốn đăng ký tài khoản khác?",
        label: "Đăng ký lại",
        href: "/dang-ky",
      }}
    >
      <Suspense fallback={null}>
        <EmailVerificationPanel />
      </Suspense>
    </AuthShell>
  );
}
