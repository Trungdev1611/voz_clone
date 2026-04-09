"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

export type NewThreadDraft = {
  title: string;
  body: string;
};

export function NewThreadComposer({
  forumName,
  onCreate,
  isSubmitting = false,
}: {
  forumName: string;
  onCreate: (draft: NewThreadDraft) => Promise<void> | void;
  isSubmitting?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const canSubmit = useMemo(() => title.trim().length >= 5, [title]);

  function reset() {
    setTitle("");
    setBody("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      await onCreate({ title: title.trim(), body: body.trim() });
      toast.success("Đã tạo chủ đề mới.");
      reset();
      setOpen(false);
    } catch {
      toast.error("Tạo chủ đề thất bại.");
    }
  }

  return (
    <section className="mb-3 overflow-hidden rounded border border-[var(--forum-border)]">
      <div className="forum-category-head flex flex-wrap items-center justify-between gap-2 px-3 py-2">
        <div className="text-[12px] text-[var(--forum-muted)]">
          Đang xem box:{" "}
          <span className="font-semibold text-[var(--forum-text)]">
            {forumName}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          disabled={isSubmitting}
          className="rounded border border-[var(--forum-border)] bg-[var(--forum-panel)] px-2 py-1 text-[11px] text-[var(--forum-text)] hover:bg-[var(--forum-row-hover)]"
        >
          {open ? "Đóng" : "+ Tạo bài viết mới"}
        </button>
      </div>

      {open ? (
        <form
          onSubmit={handleSubmit}
          className="border-t border-[var(--forum-border)] bg-[var(--forum-bg)] px-3 py-3"
        >
          <div className="grid gap-2">
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[var(--forum-text)]">
                Tiêu đề
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="forum-input w-full rounded border border-[var(--forum-border)] bg-[var(--forum-panel)] px-3 py-2 text-[13px] text-[var(--forum-text)] placeholder:text-[var(--forum-muted)]"
                placeholder="Nhập tiêu đề (tối thiểu 5 ký tự)…"
                minLength={5}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[var(--forum-text)]">
                Nội dung
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="forum-input min-h-[120px] w-full resize-y rounded border border-[var(--forum-border)] bg-[var(--forum-panel)] px-3 py-2 text-[13px] text-[var(--forum-text)] placeholder:text-[var(--forum-muted)]"
                placeholder="Nội dung bài mở đầu chủ đề…"
              />
              <p className="mt-1 text-[11px] text-[var(--forum-muted)]">
                Tip: khi nối API, form này sẽ POST tạo thread + post đầu tiên.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
                className="rounded border border-[var(--forum-border)] bg-[var(--forum-panel)] px-3 py-1.5 text-[12px] text-[var(--forum-text)] hover:bg-[var(--forum-row-hover)]"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="rounded bg-[var(--forum-accent)] px-3 py-1.5 text-[12px] font-semibold text-[var(--forum-accent-contrast)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Đang đăng..." : "Đăng chủ đề"}
              </button>
            </div>
          </div>
        </form>
      ) : null}
    </section>
  );
}
