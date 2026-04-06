import { AxiosError } from "axios";
type ApiErrorPayload = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

function toErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorPayload | undefined;
    const message = data?.message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
  }
  if (error instanceof Error) return error.message;
  return "Có lỗi xảy ra, vui lòng thử lại.";
}
export { toErrorMessage };