import { getToken } from "./auth";

// ---------------------------------------------------------------------------
// Backend response envelope
// ---------------------------------------------------------------------------
export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorDetails: unknown;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ---------------------------------------------------------------------------
// Custom error class – carries structured backend error info
// ---------------------------------------------------------------------------
export class ApiError extends Error {
  public statusCode: number;
  public errorDetails: unknown;

  constructor({
    message,
    statusCode,
    errorDetails,
  }: {
    message: string;
    statusCode: number;
    errorDetails: unknown;
  }) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
  }
}

// ---------------------------------------------------------------------------
// Base URL
// ---------------------------------------------------------------------------
export const BASE_URL = "https://assignment4-programminghero.onrender.com/api";

// ---------------------------------------------------------------------------
// Generic fetch wrapper (unwraps body.data)
// ---------------------------------------------------------------------------
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const fullRes = await apiFetchFull<T>(endpoint, options);
  return fullRes.data;
}

// ---------------------------------------------------------------------------
// Generic fetch wrapper returning full success envelope (includes backend message)
// ---------------------------------------------------------------------------
export async function apiFetchFull<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiSuccessResponse<T>> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err) {
    throw new ApiError({
      message: "Network error: Unable to connect to server. Please check your connection or backend status.",
      statusCode: 0,
      errorDetails: err,
    });
  }

  // Handle non-JSON responses (e.g. 500 plain-text errors)
  let body: ApiResponse<T>;
  try {
    body = await response.json();
  } catch {
    throw new ApiError({
      message: `Server returned ${response.status} with non-JSON response`,
      statusCode: response.status,
      errorDetails: null,
    });
  }

  if (!body.success) {
    throw new ApiError({
      message: body.message,
      statusCode: response.status,
      errorDetails: body.errorDetails,
    });
  }

  return body;
}
