"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/actions/auth";
import { Input, Button } from "@/components/ui";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div
          role="alert"
          className="p-3 bg-danger/10 border-2 border-danger rounded-[8px] text-danger text-sm font-bold flex items-center gap-2"
        >
          <span aria-hidden="true">⚠️</span>
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <Input
          id="admin-username"
          name="username"
          label="Username Admin"
          placeholder="Masukkan username"
          autoComplete="username"
          required
          error={state?.fieldErrors?.username?.[0]}
        />
      </div>

      <div>
        <Input
          id="admin-password"
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••••••"
          autoComplete="current-password"
          required
          error={state?.fieldErrors?.password?.[0]}
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isPending}
          className="w-full font-bold shadow-[var(--shadow-brutal-sm)]"
        >
          {isPending ? "Memverifikasi..." : "Masuk ke Dashboard →"}
        </Button>
      </div>
    </form>
  );
}
