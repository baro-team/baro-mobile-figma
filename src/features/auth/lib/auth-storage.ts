import { AuthSession } from "../model/auth-types";

const AUTH_SESSION_KEY = "baro.auth.session";

export function loadStoredAuthSession(): AuthSession | null {
  try {
    const rawSession = window.localStorage.getItem(AUTH_SESSION_KEY);

    if (!rawSession) {
      return null;
    }

    return JSON.parse(rawSession) as AuthSession;
  } catch {
    window.localStorage.removeItem(AUTH_SESSION_KEY);
    return null;
  }
}

export function saveAuthSession(session: AuthSession) {
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  window.localStorage.removeItem(AUTH_SESSION_KEY);
}
