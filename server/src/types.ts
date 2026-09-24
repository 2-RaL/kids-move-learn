export interface User {
  id: string;
  username: string;
  passwordHash: string;
  displayName: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export type SafeUser = Omit<User, 'passwordHash'>;

export interface AuthTokenPayload {
  userId: string;
  username: string;
  role: 'admin' | 'user';
}
