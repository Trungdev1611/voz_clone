import { ThreadPageContent } from "@/components/thread/thread-page-content";

type Props = { params: Promise<{ threadId: string }> };

export default async function ThreadPage({ params }: Props) {
  const { threadId } = await params;
  return <ThreadPageContent threadId={threadId} />;
}
