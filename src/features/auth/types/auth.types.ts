export enum UserRole {
  OWNER = 'OWNER',
  TENANT = 'TENANT',
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
