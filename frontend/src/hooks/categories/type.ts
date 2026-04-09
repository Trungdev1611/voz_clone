/** Khớp `CategoryForumEntity` từ backend (JSON snake_case). */
export type ForumRow = {
  id: number;
  name: string;
  description?: string | null;
  slug: string;
  /** Số chủ đề (thread). */
  post_count: number;
  /** Tổng số bài / message. */
  message_count: number;
  last_post_id?: number;
  category_id?: number | null;
  /** Khi BE thêm join thread cuối — optional. */
  last_thread_title?: string | null;
  last_post_at?: string | null;
  last_post_by?: string | null;
};

/** Category gốc: `category_id === null`, có `forums`. */
export type CategoryRow = ForumRow & {
  category_id: null;
  forums: ForumRow[];
};

export type Category = CategoryRow;
