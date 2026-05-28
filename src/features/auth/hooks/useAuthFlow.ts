import { FormEvent, useCallback, useState } from "react";
import { submitAuth } from "../lib/auth-api";
import {
  clearAuthSession,
  loadStoredAuthSession,
  saveAuthSession,
} from "../lib/auth-storage";
import { AuthCredentials, AuthMode, AuthSession } from "../model/auth-types";

const INITIAL_CREDENTIALS: AuthCredentials = {
  email: "",
  password: "",
};

export function useAuthFlow() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [credentials, setCredentials] =
    useState<AuthCredentials>(INITIAL_CREDENTIALS);
  const [session, setSession] = useState<AuthSession | null>(() =>
    loadStoredAuthSession(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCredential = useCallback(
    (field: keyof AuthCredentials, value: string) => {
      setCredentials((current) => ({
        ...current,
        [field]: value,
      }));
      setError(null);
    },
    [],
  );

  const changeMode = useCallback((nextMode: AuthMode) => {
    setMode(nextMode);
    setError(null);
  }, []);

  const submit = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      if (isSubmitting) {
        return;
      }

      const email = credentials.email.trim();
      const password = credentials.password;

      if (!email || !password) {
        setError("이메일과 비밀번호를 모두 입력해주세요.");
        return;
      }

      if (password.length < 8) {
        setError("비밀번호는 8자 이상 입력해주세요.");
        return;
      }

      try {
        setIsSubmitting(true);
        setError(null);

        const nextSession = await submitAuth(mode, { email, password });

        saveAuthSession(nextSession);
        setSession(nextSession);
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "인증 요청 중 오류가 발생했습니다.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [credentials.email, credentials.password, isSubmitting, mode],
  );

  const logout = useCallback(() => {
    clearAuthSession();
    setSession(null);
    setCredentials(INITIAL_CREDENTIALS);
    setError(null);
  }, []);

  return {
    mode,
    credentials,
    session,
    isSubmitting,
    error,
    changeMode,
    updateCredential,
    submit,
    logout,
  };
}
