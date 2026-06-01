export type ErrorResponse = {
  message?: string;
  error?: {
    message?: string;
  };
};

export function getErrorMessage(response: unknown) {
  if (!response || typeof response !== "object") {
    return null;
  }

  const errorResponse = response as ErrorResponse;

  return errorResponse.error?.message || errorResponse.message || null;
}
