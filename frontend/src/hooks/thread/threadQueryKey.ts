export const threadQueryKeys = {
  all: ["thread"] as const,
  listByCategorySlug: (categorySlug: string) =>
    [...threadQueryKeys.all, "list", categorySlug] as const,
};

