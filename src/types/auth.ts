export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
  };
}

export interface AuthSession {
  user: User | null;
  session: {
    access_token: string;
    expires_in: number;
    expires_at?: number;
    refresh_token: string;
    token_type: string;
  } | null;
}
