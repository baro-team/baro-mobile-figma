import { FormEvent } from "react";
import { AuthForm } from "../../features/auth";
import { AuthCredentials, AuthMode } from "../../features/auth/model/auth-types";

type AuthPageProps = {
  mode: AuthMode;
  credentials: AuthCredentials;
  isSubmitting: boolean;
  error: string | null;
  onModeChange: (mode: AuthMode) => void;
  onCredentialChange: (field: keyof AuthCredentials, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function AuthPage(props: AuthPageProps) {
  return <AuthForm {...props} />;
}
