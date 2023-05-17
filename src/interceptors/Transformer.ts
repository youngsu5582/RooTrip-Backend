import { Try } from "../types";
export function createResponseForm<T>(data: T, message?: string): Try<T> {
  return {
    status: true,
    ...(data !== null && { data }),
    message,
  } as const;
}
