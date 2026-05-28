import {
  AuthApiResponse,
  AuthCredentials,
  AuthMode,
  AuthSession,
} from "../model/auth-types";

function getAuthPath(mode: AuthMode) {
  return mode === "sign-up" ? "/api/auth/sign-up" : "/api/auth/login";
}

function getFallbackErrorMessage(mode: AuthMode) {
  return mode === "sign-up"
    ? "회원가입에 실패했습니다. 입력 정보를 확인해주세요."
    : "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
}

function normalizeAuthSession(response: AuthApiResponse): AuthSession {
  if (!response.success || !response.data) {
    throw new Error(
      response.error?.message ||
        response.message ||
        "인증 응답을 확인할 수 없습니다.",
    );
  }

  const userId = response.data.userId ?? response.data.user_id;
  const accessToken = response.data.accessToken ?? response.data.access_token;
  const refreshToken = response.data.refreshToken ?? response.data.refresh_token;

  if (!userId || !accessToken || !refreshToken) {
    throw new Error("인증 응답 형식이 올바르지 않습니다.");
  }

  return {
    userId,
    email: response.data.email,
    accessToken,
    refreshToken,
  };
}

export async function submitAuth(
  mode: AuthMode,
  credentials: AuthCredentials,
): Promise<AuthSession> {
  const response = await fetch(getAuthPath(mode), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  let data: AuthApiResponse | null = null;

  try {
    data = (await response.json()) as AuthApiResponse;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.error?.message || data?.message || getFallbackErrorMessage(mode),
    );
  }

  if (!data) {
    throw new Error(getFallbackErrorMessage(mode));
  }

  return normalizeAuthSession(data);
}
