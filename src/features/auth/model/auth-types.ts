export type AuthMode = "login" | "sign-up";

export type AuthCredentials = {
  email: string;
  password: string;
};

export type AuthUser = {
  userId: number;
  email: string;
};

export type AuthSession = AuthUser & {
  accessToken: string;
  refreshToken: string;
};

export type AuthApiResponse = {
  success: boolean;
  data?: {
    user_id: number;
    email: string;
    access_token: string;
    refresh_token: string;
  };
  message?: string;
};
