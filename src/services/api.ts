import type { LoginResponse, Post, PostInput } from "../types";

const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

function getToken() {
  return localStorage.getItem("blog.token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = "Não foi possível concluir a solicitação.";
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // Mantém a mensagem padrão quando a API não retorna JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  getPosts: () => request<Post[]>("/posts"),

  getPost(id: string) {
    return request<Post>(`/posts/${encodeURIComponent(id)}`);
  },

  createPost(post: PostInput) {
    return request<Post>("/posts", { method: "POST", body: JSON.stringify(post) });
  },

  updatePost(id: string, post: PostInput) {
    return request<Post>(`/posts/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(post),
    });
  },

  deletePost(id: string | number) {
    return request<void>(`/posts/${encodeURIComponent(String(id))}`, { method: "DELETE" });
  },

  login(email: string, password: string) {
    return request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
};
