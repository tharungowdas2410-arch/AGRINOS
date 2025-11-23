const API_BASE_URL = (() => {
  const raw = import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).trim() : "";
  if (raw) {
    const trimmed = raw.replace(/\/+$/, "");
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  }
  return typeof window !== "undefined" ? "/api" : "http://localhost:8080/api";
})();

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const getSession = () => {
  const raw = localStorage.getItem("plant_classifier_session");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as {
      tokens: { accessToken: string; refreshToken: string };
    };
  } catch {
    return null;
  }
};

const request = async <T>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: BodyInit | null;
    headers?: Record<string, string>;
    isFormData?: boolean;
  } = {}
): Promise<T> => {
  const session = getSession();
  const headers: Record<string, string> = options.headers ? { ...options.headers } : {};

  if (!options.isFormData) {
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
  }

  if (session?.tokens?.accessToken) {
    headers.Authorization = `Bearer ${session.tokens.accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    body: options.body ?? null,
    headers,
    credentials: "include"
  });

  if (response.status === 401 && session?.tokens?.refreshToken) {
    const refreshed = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: session.tokens.refreshToken })
    });

    if (refreshed.ok) {
      const tokens = await refreshed.json();
      const rawSession = localStorage.getItem("plant_classifier_session");
      if (rawSession) {
        const parsed = JSON.parse(rawSession);
        parsed.tokens = tokens;
        localStorage.setItem("plant_classifier_session", JSON.stringify(parsed));
      }
      return request<T>(path, options);
    } else {
      localStorage.removeItem("plant_classifier_session");
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || "Request failed");
  }

  return response.json() as Promise<T>;
};

export const api = {
  manualLogin: (payload: { email: string; name?: string; role: string }) =>
    request<{ user: { id: string; email: string; name: string; role: string }; tokens: { accessToken: string; refreshToken: string } }>("/auth/manual", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  logout: () =>
    request("/auth/logout", {
      method: "POST"
    }),
  me: () => request("/auth/me"),
  predict: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return request<{ predictionId: string; result: unknown }>("/predict", {
      method: "POST",
      body: form,
      isFormData: true
    });
  },
  predictionHistory: () => request("/predict/history"),
  sensorHistory: () => request("/sensor/history"),
  getPlant: (species: string) => request(`/plant/${encodeURIComponent(species)}`),
  listPlants: () => request("/plant")
};

