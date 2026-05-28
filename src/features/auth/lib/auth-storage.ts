import { AuthSession } from "../model/auth-types";

const AUTH_SESSION_KEY = "baro.auth.session";

export function loadStoredAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawSession = window.localStorage.getItem(AUTH_SESSION_KEY);

    if (!rawSession) {
      return null;
    }

    return JSON.parse(rawSession) as AuthSession;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function saveAuthSession(session: AuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  } catch {
    // localStorage에 접근할 수 없는 경우 세션 저장을 건너뜁니다.
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(AUTH_SESSION_KEY);
  } catch {
    // localStorage에 접근할 수 없는 경우 무시합니다.
  }
}
