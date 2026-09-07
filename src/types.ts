export interface Post {
  id: string | number;
  title: string;
  content: string;
  author: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostInput {
  title: string;
  content: string;
  author: string;
}

export interface AuthUser {
  name?: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
