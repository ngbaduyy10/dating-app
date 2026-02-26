import { auth } from "@/auth";

const API_BASE_URL = `${process.env.BE_URL}/api`;

type NextFetchRequestConfig = {
  revalidate?: number | false;
  tags?: string[];
};

interface FetchAPIOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  authToken?: string;
  body?: Record<string, unknown> | string | FormData;
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
}

export async function fetchApi(url: string, options?: FetchAPIOptions) {
  const { method, authToken, body, next, cache } = options || {};

  const isFormData = body instanceof FormData;

  const headers: RequestInit & { next?: NextFetchRequestConfig } = {
    method: method || "GET",
    headers: {
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    ...(body && { body: isFormData ? body : JSON.stringify(body) }),
    ...(next && { next }),
    ...(cache && { cache }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, headers);
    const contentType = response.headers.get("content-type");
    const data = await response.json();
    if (
      contentType &&
      contentType.includes("application/json") &&
      response.ok
    ) {
      return { success: true, ...data };
    } else {
      return { success: false, ...data };
    }
  } catch (error) {
    console.error(`Error ${method} data:`, error);
    throw error;
  }
}

export async function fetchApiWithAuth(url: string, options?: Omit<FetchAPIOptions, 'authToken'>) {
  try {
    const session = await auth();
    
    if (!session?.user?.access_token) {
      throw new Error("No access token found in session");
    }

    return fetchApi(url, {
      ...options,
      authToken: session.user.access_token,
    });
  } catch (error) {
    console.error("Error fetching with auth:", error);
    throw error;
  }
}
