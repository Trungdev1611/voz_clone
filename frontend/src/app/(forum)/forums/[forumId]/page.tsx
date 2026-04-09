import { ForumThreadsPageContent } from "@/components/forums/forum-threads-page-content";

type Props = { params: Promise<{ forumId: string }> };

export default async function ForumThreadsPage({ params }: Props) {
  const { forumId } = await params;

  return <ForumThreadsPageContent forumKey={forumId} />;
}
