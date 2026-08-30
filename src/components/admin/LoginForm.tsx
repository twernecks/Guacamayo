"use client";

import { useState, type FormEvent } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { ApiError } from "@/domain/admin/shared";
import { Field } from "@/components/admin/ui/Field";
import { Card } from "@/components/admin/ui/Card";
import { Banner } from "@/components/admin/ui/Banner";
import { Button } from "@/components/ui/Button";
import styles from "./LoginForm.module.css";

/**
 * No `onSuccess`/navigation prop on purpose: once `login()` resolves, the
 * shared route guard (`src/components/admin/AdminShell.tsx`) reactively
 * moves the admin away from `/admin/login` (to `?from=` or the default
 * landing page) as soon as `status` flips to "authenticated" — the single
 * place that decides the post-login destination (FR-008), so this form
 * doesn't also try to navigate and race it.
 */
export function LoginForm() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      // No further action here — see the note above.
    } catch (err) {
      if (err instanceof ApiError && err.code === "NETWORK_ERROR") {
        // FR-027: a network/connectivity failure is shown distinctly from a
        // credentials problem, not folded into the same generic message.
        setError("Não foi possível se comunicar com o servidor. Verifique sua conexão.");
      } else {
        // FR-006: the exact same message for "email doesn't exist" and
        // "wrong password" — never reveals which one it was.
        setError("Email ou senha inválidos.");
      }
      setIsSubmitting(false);
    }
  }

  return (
    <Card className={styles.container}>
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <Field label="Email" htmlFor="admin-email">
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>
        <Field label="Senha" htmlFor="admin-password">
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        {error ? (
          <Banner variant="error" role="alert">
            {error}
          </Banner>
        ) : null}
        <Button type="submit" disabled={isSubmitting} className={styles.submit}>
          {isSubmitting ? "Entrando…" : "Entrar"}
        </Button>
      </form>
    </Card>
  );
}
