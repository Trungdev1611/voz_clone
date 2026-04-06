import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Đăng nhập",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Đăng nhập"
      subtitle="Dùng tài khoản diễn đàn để tham gia thảo luận."
      footerLink={{
        hint: "Chưa có tài khoản?",
        label: "Đăng ký",
        href: "/dang-ky",
      }}
    >
      <LoginForm />
    </AuthShell>
  );
}
