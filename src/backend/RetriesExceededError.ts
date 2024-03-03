export class RetriesExceededError extends Error {
  constructor(message = "", opts: ErrorOptions = { cause: null }) {
    super(message, opts);
  }
}

export function isRetriesExceeded(error: unknown): boolean {
  return error instanceof RetriesExceededError
}
