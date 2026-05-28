import { FormEvent } from "react";
import { Button } from "../../../app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../app/components/ui/card";
import { Input } from "../../../app/components/ui/input";
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
} satisfies Record<AuthMode, { title: string; description: string; submitLabel: string }>;

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
    <div className="relative flex min-h-dvh w-full items-start justify-center overflow-y-auto bg-[#08111f] px-5 py-8 text-slate-950 sm:items-center">
      <div className="absolute left-1/2 top-[-140px] h-80 w-80 -translate-x-1/2 rounded-full bg-sky-400/35 blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-90px] h-72 w-72 rounded-full bg-blue-600/30 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-white">
          <div className="mb-4 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            BARO Mobility
          </div>
          <h1 className="text-4xl font-semibold tracking-[-0.04em]">
            지금 바로,
            <br />더 편한 이동
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            회원가입 또는 로그인 후 목적지를 입력하고 배차를 요청하세요.
          </p>
        </div>

        <Card className="border-white/70 bg-white/95 shadow-2xl shadow-black/30 backdrop-blur">
          <CardHeader>
            <div className="mb-4 grid grid-cols-2 rounded-full bg-slate-100 p-1 text-sm font-semibold">
              <button
                type="button"
                aria-pressed={mode === "login"}
                disabled={isSubmitting}
                className={`rounded-full px-4 py-2 transition ${
                  mode === "login"
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-500"
                }`}
                onClick={() => onModeChange("login")}
              >
                로그인
              </button>
              <button
                type="button"
                aria-pressed={mode === "sign-up"}
                disabled={isSubmitting}
                className={`rounded-full px-4 py-2 transition ${
                  mode === "sign-up"
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-500"
                }`}
                onClick={() => onModeChange("sign-up")}
              >
                회원가입
              </button>
            </div>
            <CardTitle className="text-2xl font-semibold tracking-[-0.03em]">
              {copy.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {copy.description}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <label className="block space-y-2 text-sm font-medium text-slate-700">
                <span>이메일</span>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={credentials.email}
                  onChange={(event) =>
                    onCredentialChange("email", event.target.value)
                  }
                  className="h-12 rounded-2xl bg-white"
                />
              </label>

              <label className="block space-y-2 text-sm font-medium text-slate-700">
                <span>비밀번호</span>
                <Input
                  type="password"
                  autoComplete={
                    mode === "sign-up" ? "new-password" : "current-password"
                  }
                  placeholder="8자 이상 입력"
                  value={credentials.password}
                  onChange={(event) =>
                    onCredentialChange("password", event.target.value)
                  }
                  className="h-12 rounded-2xl bg-white"
                />
              </label>

              {error ? (
                <div
                  aria-live="polite"
                  className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                >
                  {error}
                </div>
              ) : null}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-2xl bg-blue-600 text-base font-semibold text-white hover:bg-blue-700"
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
