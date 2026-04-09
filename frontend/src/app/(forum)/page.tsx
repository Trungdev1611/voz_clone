import { ForumHomeContent } from "@/components/home/forum-home-content";
import { Breadcrumb } from "@/components/common/breadcrumb";

export default function ForumHomePage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Trang chủ" }]} />
      <p className="mb-4 text-[13px] leading-relaxed text-[var(--forum-muted)]">
        Diễn đàn thử nghiệm — giao diện tham chiếu layout forum kiểu Voz. Danh mục
        và box lấy từ API.
      </p>
      <ForumHomeContent />
    </>
  );
}
