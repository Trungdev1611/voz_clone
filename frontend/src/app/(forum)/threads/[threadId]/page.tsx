import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/forum/breadcrumb";
import { ThreadView } from "@/components/forum/thread-view";
import {
  getCategoryForForum,
  getForumById,
  getThreadById,
  mockPostsByThread,
} from "@/lib/mock-forum";

type Props = { params: Promise<{ threadId: string }> };

export default async function ThreadPage({ params }: Props) {
  const { threadId } = await params;
  const thread = getThreadById(threadId);
  if (!thread) notFound();
  const forum = getForumById(thread.forumId);
  const category = forum ? getCategoryForForum(thread.forumId) : undefined;
  const posts = mockPostsByThread[threadId] ?? [];

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          ...(forum
            ? [
                ...(category
                  ? [{ label: category.name, href: "/" }]
                  : []),
                { label: forum.name, href: `/forums/${forum.id}` },
              ]
            : []),
          { label: "Chủ đề" },
        ]}
      />
      <div className="mb-3 text-[12px]">
        <Link
          href={`/forums/${thread.forumId}`}
          className="text-[var(--forum-link)] hover:underline"
        >
          ← Quay lại danh sách chủ đề
        </Link>
      </div>
      <ThreadView thread={thread} posts={posts} />
    </>
  );
}
