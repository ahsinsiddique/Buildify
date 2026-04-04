"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { useAuth } from "./auth-provider";

type Mode = "login" | "signup";

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("manager");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register } = useAuth();

  const nextPath = useMemo(() => searchParams.get("next") ?? "/dashboard", [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login({ email, password });
      } else {
        await register({ name, email, password, role });
      }

      router.replace(nextPath);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to complete authentication"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <div className="rounded-[2rem] bg-[linear-gradient(160deg,rgba(15,23,42,0.98),rgba(54,88,71,0.88))] p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.25em] text-white/60">BrickFlow ERP</p>
        <h1 className="mt-4 font-display text-5xl">
          Sign in to manage projects, plots, costs, and teams.
        </h1>
        <div className="mt-8 space-y-4 text-sm text-white/80">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            Authenticated users can access the dashboard and CRUD workflows.
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            Managers can create operational records. Admins can delete records.
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            New accounts can register here and immediately enter the dashboard.
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-white/75 p-8 shadow-sm backdrop-blur">
        <div className="mb-6 flex gap-3">
          <button
            className={`rounded-full px-5 py-2 text-sm font-medium ${
              mode === "login" ? "bg-ink text-white" : "bg-slate-100 text-slate-700"
            }`}
            onClick={() => setMode("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={`rounded-full px-5 py-2 text-sm font-medium ${
              mode === "signup" ? "bg-ink text-white" : "bg-slate-100 text-slate-700"
            }`}
            onClick={() => setMode("signup")}
            type="button"
          >
            Sign up
          </button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <label className="grid gap-2 text-sm">
              Full name
              <input
                className="rounded-2xl border border-black/10 px-4 py-3 outline-none"
                onChange={(event) => setName(event.target.value)}
                required
                value={name}
              />
            </label>
          ) : null}

          <label className="grid gap-2 text-sm">
            Email
            <input
              className="rounded-2xl border border-black/10 px-4 py-3 outline-none"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>

          <label className="grid gap-2 text-sm">
            Password
            <input
              className="rounded-2xl border border-black/10 px-4 py-3 outline-none"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {mode === "signup" ? (
            <label className="grid gap-2 text-sm">
              Role
              <select
                className="rounded-2xl border border-black/10 px-4 py-3 outline-none"
                onChange={(event) => setRole(event.target.value)}
                value={role}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="accountant">Accountant</option>
                <option value="worker">Worker</option>
              </select>
            </label>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? "Please wait..."
              : mode === "login"
                ? "Login to dashboard"
                : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
