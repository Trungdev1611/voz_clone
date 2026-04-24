import { ThreadPageContent } from "@/components/thread/thread-page-content";

type Props = { params: Promise<{ forumId: string; threadId: string }> };

export default async function ForumThreadPage({ params }: Props) {
  const { threadId } = await params;
  return <ThreadPageContent threadId={threadId} />;
}
