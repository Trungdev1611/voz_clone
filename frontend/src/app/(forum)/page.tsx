import { ForumCategoryBlock } from "@/components/forum/forum-category-block";
import { Breadcrumb } from "@/components/forum/breadcrumb";
import { mockCategories } from "@/lib/mock-forum";

export default function ForumHomePage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Trang chủ" }]} />
      <p className="mb-4 text-[13px] leading-relaxed text-[var(--forum-muted)]">
        Diễn đàn thử nghiệm — giao diện tham chiếu layout forum kiểu Voz. Dữ liệu
        đang dùng mock trong{" "}
        <code className="rounded bg-[var(--forum-panel)] px-1 font-mono text-[11px]">
          src/lib/mock-forum.ts
        </code>
        .
      </p>
      {mockCategories.map((cat) => (
        <ForumCategoryBlock key={cat.id} category={cat} />
      ))}
    </>
  );
}
