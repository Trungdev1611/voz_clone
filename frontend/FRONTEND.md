# Frontend — Voz Clone

## Mục đích

Giao diện forum kiểu Voz (header tối, bảng box/chủ đề, bài viết hai cột: user + nội dung). Hiện dùng **dữ liệu mock** trong `src/lib/mock-forum.ts`; sau này thay bằng gọi API (axios + React Query).

## Cấu trúc nhanh

| Đường dẫn | Ý nghĩa |
|-----------|---------|
| `src/app/(forum)/layout.tsx` | Khung: header, footer, sidebar |
| `src/app/(forum)/page.tsx` | Trang chủ — danh sách category & box |
| `src/app/(forum)/forums/[forumId]/page.tsx` | Danh sách chủ đề trong một box |
| `src/app/(forum)/threads/[threadId]/page.tsx` | Một chủ đề + các bài viết |
| `src/components/forum/*` | Header, breadcrumb, bảng, post card, sidebar |
| `src/lib/mock-forum.ts` | Mock — mapping 1:1 với shape API sau này |

**Thử trên mock:** vào `/` → click tên box → click tiêu đề chủ đề. Ví dụ thread có sẵn: `/threads/t-1`, `/threads/t-2`.

---

## Thứ tự nên ghép API (khuyến nghị)

Làm theo thứ tự dưới đây để luồng UX và phụ thuộc giữa các màn hình hợp lý (backend có thể làm song song, nhưng frontend nên xử lý lần lượt).

### Giai đoạn A — Nền

1. **Client HTTP** — `axios` instance + `NEXT_PUBLIC_API_URL`, interceptor gắn JWT (sau khi có auth).
2. **React Query** — hooks `useQuery` / `useMutation` theo từng resource; tách `lib/api/*` hoặc `features/*/api.ts`.

### Giai đoạn B — Điều hướng & nội dung đọc

3. **Trang chủ** — `GET` categories + forums (thay `mockCategories`).
4. **Danh sách chủ đề** — `GET /forums/:id/threads` (pagination, sort); thay `mockThreadsByForum`.
5. **Chi tiết chủ đề** — `GET /threads/:id` + `GET /threads/:id/posts` (cursor/page); thay `mockPostsByThread`.
6. **Breadcrumb** — build từ response (tên category, forum) thay vì suy ra từ mock.

### Giai đoạn C — Người dùng

7. **Đăng ký / đăng nhập / đăng xuất** — form + lưu token; cập nhật `SiteHeader` (ẩn nút Khách, hiện menu user).
8. **Refresh token** (nếu BE có) — interceptor axios; optional silent refresh.

### Giai đoạn D — Ghi nội dung

9. **Tạo chủ đề** — nút “Chủ đề mới” trên `/forums/[id]` + form (tiêu đề, nội dung).
10. **Trả lời** — textarea cuối thread + `POST` reply; optimistic UI tùy chọn.

### Giai đoạn E — Cải thiện forum thật

11. **Tìm kiếm** — bật ô search header; `GET /search?q=`.
12. **Trích dẫn / BBCode / rich text** — render an toàn (sanitize) khớp BE.
13. **Ghim / khóa / quyền** — ẩn/hiện nút theo role; badge đã có sẵn trên UI.
14. **Thông báo + realtime** — badge, sau đó WebSocket/SSE nếu có.
15. **Reaction / báo cáo** — link “Báo cáo · Trích dẫn” đang placeholder.

### Giai đoạn F — Vận hành UI

16. **Loading / error / empty** — skeleton, toast, retry cho mọi query.
17. **SEO & metadata** — `generateMetadata` cho `/threads/[id]` (title thread).
18. **Mobile** — sidebar stats có thể gộp drawer hoặc ẩn (hiện đã ẩn sidebar trên màn nhỏ).

---

## Ghi chú

- Style forum dùng biến CSS trong `src/app/globals.css` (`--forum-*`) — đổi palette một chỗ.
- Khi xóa mock, giữ type/interface từ API (hoặc generate từ OpenAPI) để tránh lệch field.
