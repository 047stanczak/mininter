export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
  bio?: string;
  status?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
