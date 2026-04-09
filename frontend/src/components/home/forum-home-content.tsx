"use client";

import { ForumCategoryBlock } from "./forum-category-block";
import { useCategoryQuery } from "@/hooks/categories/use-category";

export function ForumHomeContent() {
  const { data: categories = [], isLoading } = useCategoryQuery();

  if (isLoading) {
    return (
      <p className="text-[13px] text-[var(--forum-muted)]">Đang tải danh mục…</p>
    );
  }

  return (
    <>
      {categories.map((cat) => (
        <ForumCategoryBlock key={cat.id} category={cat} />
      ))}
    </>
  );
}
