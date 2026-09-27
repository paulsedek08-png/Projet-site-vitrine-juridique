import { CONFIG } from "./config.js";

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function token() {
  return sessionStorage.getItem("admin_token");
}

export async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token()) headers.set("Authorization", `Bearer ${token()}`);

  let response;
  try {
    response = await fetch(`${CONFIG.API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("API inaccessible. Vérifiez que FastAPI est démarré et que CORS est autorisé.");
  }

  const type = response.headers.get("content-type") || "";
  const data = type.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    const detail = data?.detail;
    const message = Array.isArray(detail)
      ? detail.map((item) => item.msg).join(", ")
      : detail || data?.message || `Erreur HTTP ${response.status}`;
    throw new ApiError(message, response.status, data);
  }
  return data;
}

export const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  return payload?.items || payload?.documents || payload?.results || payload?.data || [];
};

