import { FormEvent } from "react";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { AuthCredentials, AuthMode } from "../model/auth-types";

type AuthFormProps = {
  mode: AuthMode;
  credentials: AuthCredentials;
  isSubmitting: boolean;
  error: string | null;
  onModeChange: (mode: AuthMode) => void;
  onCredentialChange: (field: keyof AuthCredentials, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const modeCopy = {
  login: {
    title: "다시 만나서 반가워요",
    description: "바로 호출을 시작하려면 로그인해주세요.",
    submitLabel: "로그인",
  },
  "sign-up": {
    title: "바로 시작하기",
    description: "이메일과 비밀번호만으로 바로 가입할 수 있어요.",
    submitLabel: "회원가입",
  },
} satisfies Record<
  AuthMode,
  { title: string; description: string; submitLabel: string }
>;

export function AuthForm({
  mode,
  credentials,
  isSubmitting,
  error,
  onModeChange,
  onCredentialChange,
  onSubmit,
}: AuthFormProps) {
  const copy = modeCopy[mode];

  return (
    <div className="app-screen app-scroll-area flex w-full items-start justify-center overflow-y-auto bg-white px-5 py-8 text-slate-900">
      <div className="app-mobile-frame space-y-7">
        <div className="space-y-4 pt-2">
          <div className="ds-inline-card inline-flex w-fit items-center px-3 py-1.5">
            <span className="type-caption text-sky-700">BARO Mobility</span>
          </div>

          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-900 leading-tight">
              지금 바로,
              <br />더 편한 이동
            </h1>
          </div>
        </div>

        <Card className="ds-card overflow-hidden border-sky-100 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <CardHeader className="gap-4 px-6 pt-6">
            <div className="grid grid-cols-2 rounded-full border border-sky-100 bg-sky-50 p-1 text-sm font-semibold">
              <button
                type="button"
                aria-pressed={mode === "login"}
                disabled={isSubmitting}
                className={`tap-target rounded-full px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                  mode === "login"
                    ? "bg-white text-sky-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => onModeChange("login")}
              >
                로그인
              </button>
              <button
                type="button"
                aria-pressed={mode === "sign-up"}
                disabled={isSubmitting}
                className={`tap-target rounded-full px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                  mode === "sign-up"
                    ? "bg-white text-sky-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => onModeChange("sign-up")}
              >
                회원가입
              </button>
            </div>

            <div className="space-y-1">
              <CardTitle className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                {copy.title}
              </CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-500">
                {copy.description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-5">
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="block space-y-2">
                <Label
                  htmlFor="auth-email"
                  className="text-sm font-semibold text-slate-700"
                >
                  이메일
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-sky-400" />
                  <Input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={credentials.email}
                    onChange={(event) =>
                      onCredentialChange("email", event.target.value)
                    }
                    className="ds-input h-12 rounded-2xl pl-11 pr-4 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
                  />
                </div>
              </div>

              <div className="block space-y-2">
                <Label
                  htmlFor="auth-password"
                  className="text-sm font-semibold text-slate-700"
                >
                  비밀번호
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-sky-400" />
                  <Input
                    id="auth-password"
                    type="password"
                    autoComplete={
                      mode === "sign-up" ? "new-password" : "current-password"
                    }
                    placeholder="8자 이상 입력"
                    value={credentials.password}
                    onChange={(event) =>
                      onCredentialChange("password", event.target.value)
                    }
                    className="ds-input h-12 rounded-2xl pl-11 pr-4 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
                  />
                </div>
              </div>

              {error ? (
                <div
                  aria-live="polite"
                  className="rounded-2xl border border-red-100 bg-red-50/80 px-4 py-3 text-sm font-medium text-red-600"
                >
                  {error}
                </div>
              ) : null}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="ds-button-primary type-button tap-target h-12 w-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                {isSubmitting ? "처리 중..." : copy.submitLabel}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
