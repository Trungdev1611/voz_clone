import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/forum/breadcrumb";
import { ThreadListTable } from "@/components/forum/thread-list-table";
import {
  getCategoryForForum,
  getForumById,
  mockThreadsByForum,
} from "@/lib/mock-forum";

type Props = { params: Promise<{ forumId: string }> };

export default async function ForumThreadsPage({ params }: Props) {
  const { forumId } = await params;
  const forum = getForumById(forumId);
  if (!forum) notFound();
  const category = getCategoryForForum(forumId);
  const threads = mockThreadsByForum[forumId] ?? [];

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          ...(category
            ? [{ label: category.name, href: "/" }]
            : []),
          { label: forum.name },
        ]}
      />
      <ThreadListTable forum={forum} threads={threads} />
    </>
  );
}
