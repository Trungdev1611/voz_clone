/** Dữ liệu giả — thay bằng fetch API khi tích hợp backend. */

export type MockForum = {
  id: string;
  name: string;
  description: string;
  threadCount: number;
  postCount: number;
  lastThreadTitle: string;
  lastPostAt: string;
  lastPostBy: string;
};

export type MockCategory = {
  id: string;
  name: string;
  forums: MockForum[];
};

export type MockThread = {
  id: string;
  forumId: string;
  title: string;
  author: string;
  replyCount: number;
  viewCount: number;
  lastPostAt: string;
  lastPostBy: string;
  isPinned: boolean;
  isLocked: boolean;
};

export type MockPost = {
  id: string;
  threadId: string;
  author: string;
  userTitle: string;
  joinDate: string;
  postCount: number;
  avatarHue: number;
  body: string;
  createdAt: string;
  index: number;
};

export const mockCategories: MockCategory[] = [
  {
    id: "cat-chuyen",
    name: "Chuyện trò linh tinh",
    forums: [
      {
        id: "f-thay-thai",
        name: "Thời sự — Thế giới",
        description: "Tin tức, biến động thế giới.",
        threadCount: 12840,
        postCount: 902100,
        lastThreadTitle: "Thread demo: sau này nối API",
        lastPostAt: "Hôm nay, 14:32",
        lastPostBy: "demo_user",
      },
      {
        id: "f-cong-nghe",
        name: "Công nghệ — Khoa học",
        description: "Máy tính, điện thoại, khoa học.",
        threadCount: 5621,
        postCount: 441200,
        lastThreadTitle: "NestJS + TypeORM có ổn không?",
        lastPostAt: "Hôm qua, 21:05",
        lastPostBy: "dev_3nam",
      },
    ],
  },
  {
    id: "cat-giai-tri",
    name: "Giải trí",
    forums: [
      {
        id: "f-phim",
        name: "Phim — Truyện",
        description: "Review, spoiler có tag.",
        threadCount: 3200,
        postCount: 198000,
        lastThreadTitle: "Phim cuối tuần recommend",
        lastPostAt: "2 ngày trước",
        lastPostBy: "xem_phim",
      },
    ],
  },
];

export const mockThreadsByForum: Record<string, MockThread[]> = {
  "f-thay-thai": [
    {
      id: "t-1",
      forumId: "f-thay-thai",
      title: "[Sticky] Quy định box — đọc trước khi post",
      author: "mod_team",
      replyCount: 890,
      viewCount: 120400,
      lastPostAt: "Hôm nay, 09:00",
      lastPostBy: "mod_team",
      isPinned: true,
      isLocked: true,
    },
    {
      id: "t-2",
      forumId: "f-thay-thai",
      title: "Thảo luận chung về diễn đàn (mock)",
      author: "member_a",
      replyCount: 42,
      viewCount: 3100,
      lastPostAt: "Hôm nay, 14:32",
      lastPostBy: "demo_user",
      isPinned: false,
      isLocked: false,
    },
    {
      id: "t-3",
      forumId: "f-thay-thai",
      title: "Thread khóa — không reply được",
      author: "old_mod",
      replyCount: 12,
      viewCount: 800,
      lastPostAt: "Tuần trước",
      lastPostBy: "old_mod",
      isPinned: false,
      isLocked: true,
    },
  ],
  "f-cong-nghe": [
    {
      id: "t-4",
      forumId: "f-cong-nghe",
      title: "So sánh ORM: TypeORM vs Prisma",
      author: "backend_fan",
      replyCount: 156,
      viewCount: 22000,
      lastPostAt: "Hôm qua",
      lastPostBy: "reader_99",
      isPinned: false,
      isLocked: false,
    },
  ],
  "f-phim": [],
};

export const mockPostsByThread: Record<string, MockPost[]> = {
  "t-1": [
    {
      id: "p-1",
      threadId: "t-1",
      author: "mod_team",
      userTitle: "Quản trị viên",
      joinDate: "01-2010",
      postCount: 45200,
      avatarHue: 210,
      body: `Chào mọi người,\n\nĐây là nội dung bài viết **mock** (sau này render BBCode/HTML từ API).\n\n• Không spam\n• Trích dẫn có nguồn\n\n[QUOTE="member"]Ví dụ quote[/QUOTE]\n\nCảm ơn đã đọc.`,
      createdAt: "01-01-2024, 10:00",
      index: 1,
    },
    {
      id: "p-2",
      threadId: "t-1",
      author: "demo_user",
      userTitle: "Thành viên",
      joinDate: "03-2022",
      postCount: 1203,
      avatarHue: 28,
      body: "Đã đọc quy định, cảm ơn mod.",
      createdAt: "Hôm nay, 09:15",
      index: 2,
    },
  ],
  "t-2": [
    {
      id: "p-3",
      threadId: "t-2",
      author: "member_a",
      userTitle: "Thành viên tích cực",
      joinDate: "06-2021",
      postCount: 8900,
      avatarHue: 145,
      body: "Mọi người thấy layout clone này ổn chưa? Sau này ghép React Query + axios vào `/api`.",
      createdAt: "Hôm nay, 08:00",
      index: 1,
    },
  ],
};

export function getForumById(id: string): MockForum | undefined {
  for (const c of mockCategories) {
    const f = c.forums.find((x) => x.id === id);
    if (f) return f;
  }
  return undefined;
}

export function getCategoryForForum(forumId: string): MockCategory | undefined {
  return mockCategories.find((c) => c.forums.some((f) => f.id === forumId));
}

export function getThreadById(threadId: string): MockThread | undefined {
  for (const list of Object.values(mockThreadsByForum)) {
    const t = list.find((x) => x.id === threadId);
    if (t) return t;
  }
  return undefined;
}
