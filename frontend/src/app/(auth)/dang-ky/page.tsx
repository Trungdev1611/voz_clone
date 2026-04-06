import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Đăng ký",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Đăng ký thành viên"
      subtitle="Tạo tài khoản miễn phí để đăng bài và tương tác."
      footerLink={{
        hint: "Đã có tài khoản?",
        label: "Đăng nhập",
        href: "/dang-nhap",
      }}
    >
      <RegisterForm />
    </AuthShell>
  );
}
