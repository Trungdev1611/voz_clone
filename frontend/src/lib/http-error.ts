import { AxiosError } from "axios";

type ErrorPayload = {
  statusCode?: number;
};

export function isApiNotFoundError(error: unknown): boolean {
  if (!(error instanceof AxiosError)) {
    return false;
  }

  if (error.response?.status === 404) {
    return true;
  }

  const payload = error.response?.data as ErrorPayload | undefined;
  return payload?.statusCode === 404;
}

