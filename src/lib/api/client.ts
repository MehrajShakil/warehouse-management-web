/**
 * Thin fetch wrapper for the WarehouseManagement API.
 *
 * All requests go to the same-origin `/api/*` path, which Next.js rewrites
 * to the backend (see next.config.ts).
 */

export class ApiError extends Error {
  readonly status: number;
  /** Field-level errors from ASP.NET model validation, keyed by camelCase field name. */
  readonly fieldErrors: Record<string, string[]>;

  constructor(message: string, status: number, fieldErrors: Record<string, string[]> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/** Shape of ASP.NET Core ProblemDetails / ValidationProblemDetails responses. */
interface ProblemDetails {
  title?: string;
  detail?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

const camelCase = (key: string) => key.charAt(0).toLowerCase() + key.slice(1);

async function toApiError(response: Response): Promise<ApiError> {
  let problem: ProblemDetails = {};
  try {
    problem = (await response.json()) as ProblemDetails;
  } catch {
    // Non-JSON body (e.g. proxy error) — fall through to a generic message.
  }

  const fieldErrors: Record<string, string[]> = {};
  for (const [key, messages] of Object.entries(problem.errors ?? {})) {
    fieldErrors[camelCase(key.replace(/^\$\./, ""))] = messages;
  }

  const message =
    problem.detail ??
    Object.values(fieldErrors)[0]?.[0] ??
    problem.title ??
    (response.status >= 500
      ? "The server is unavailable. Please try again shortly."
      : `Request failed with status ${response.status}.`);

  return new ApiError(message, response.status, fieldErrors);
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, token, headers, ...init } = options;

  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(body !== undefined && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Unable to reach the server. Check your connection.", 0);
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
