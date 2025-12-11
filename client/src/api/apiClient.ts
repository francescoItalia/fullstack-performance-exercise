/**
 * API client for communicating with the backend.
 * Centralized fetch wrapper with base URL and error handling.
 */

/**
 * DEV: Uses relative URL — Vite proxy forwards to backend (see vite.config.ts)
 * PROD: Update to actual API URL or use env variable
 */
const API_BASE_URL = "/api";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  params?: Record<string, string | string[] | number | undefined>;
};

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, params } = options;

  // Build query string
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          searchParams.set(key, value.join(","));
        } else {
          searchParams.set(key, String(value));
        }
      }
    });
  }

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ""}`;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
