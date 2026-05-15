/** Dòng trong bảng danh sách chủ đề (box forum). */
export type ThreadListRow = {
  id: string;
  title: string;
  author: string;
  replyCount: number;
  viewCount: number;
  lastPostAt: string;
  lastPostBy: string;
  isPinned: boolean;
  isLocked: boolean;
};

export type ThreadDetailCategory = {
  id: number;
  name: string;
  slug: string;
};

export type ThreadDetailAuthor = {
  id: number;
  username: string;
};

export type ThreadComment = {
  id: number;
  content: string;
  threadId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  canEdit?: boolean;
  canDelete?: boolean;
  editExpiresAt?: string;
  user?: {
    id: number;
    username: string;
  } | null;
};

export type ThreadCommentList = {
  items: ThreadComment[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

/** Payload GET /v1/thread/:id (sau unwrap envelope). */
export type ThreadDetail = {
  id: number;
  title: string;
  content: string;
  slug: string;
  authorId?: number;
  categoryId?: number;
  views?: number;
  repliesCount?: number;
  lastPostAt?: string;
  lastUserId?: number;
  author?: ThreadDetailAuthor | null;
  category?: ThreadDetailCategory | null;
};

/** Phần header trang chi tiết chủ đề. */
export type ThreadViewHeader = {
  title: string;
  replyCount: number;
  viewCount: number;
  isPinned: boolean;
  isLocked: boolean;
};

/** Một “bài” hiển thị trong ThreadView (OP hoặc reply sau này). */
export type ThreadPostDisplay = {
  id: string;
  author: string;
  userTitle: string;
  joinDate: string;
  postCount: number;
  avatarHue: number;
  body: string;
  createdAt: string;
  index: number;
};
