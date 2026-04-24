"use client";

import type { ThreadListRow } from "@/types/thread";
import { ThreadListTable } from "./thread-list-table";
import {
  NewThreadComposer,
  type NewThreadDraft,
} from "./new-thread-composer";

export function ForumThreadsContent({
  forum,
  threads,
  onCreate,
  isCreating = false,
}: {
  forum: { id: string; name: string; slug: string };
  threads: ThreadListRow[];
  onCreate: (draft: NewThreadDraft) => Promise<void> | void;
  isCreating?: boolean;
}) {
  return (
    <>
      <NewThreadComposer
        forumName={forum.name}
        onCreate={onCreate}
        isSubmitting={isCreating}
      />
      <ThreadListTable forum={forum} threads={threads} />
    </>
  );
}
