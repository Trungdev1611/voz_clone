export const categoryQueryKeys = {
  categoryList: ["categories-and-forums"] as const,
  forumByKey: (forumKey: string) =>
    [...categoryQueryKeys.categoryList, "forum", forumKey] as const,
};