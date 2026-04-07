"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import appConfig from "@/lib/app-config";
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
    <div className="mx-auto grid min-h-[calc(100vh-65px)] max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <div className="border border-on-surface/7 bg-surface-container p-8 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top_left,rgba(243,202,80,0.08),transparent_60%)]" />
        <div className="relative">
          <p className="text-[9px] uppercase tracking-[0.5em] text-primary font-bold mb-6">{appConfig.appName} ERP</p>
          <h1 className="font-headline font-black text-5xl text-on-surface letter-spacing-custom leading-[0.9]">
            Sign in to manage projects, plots, costs, and teams.
          </h1>
          <div className="mt-8 space-y-3 text-sm text-on-surface-variant">
            <div className="border border-on-surface/7 bg-on-surface/3 p-4">
              Authenticated users can access the dashboard and CRUD workflows.
            </div>
            <div className="border border-on-surface/7 bg-on-surface/3 p-4">
              Managers can create operational records. Admins can delete records.
            </div>
            <div className="border border-on-surface/7 bg-on-surface/3 p-4">
              New accounts can register here and immediately enter the dashboard.
            </div>
          </div>
        </div>
      </div>

      <div className="border border-on-surface/7 bg-surface-container p-8">
        <div className="mb-6 flex gap-2">
          <button
            className={`px-5 py-2 text-[10px] font-bold uppercase tracking-[0.25em] transition-all ${
              mode === "login" ? "gold-gradient text-[#3d2f00]" : "border border-on-surface/10 text-on-surface-variant hover:text-on-surface"
            }`}
            onClick={() => setMode("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={`px-5 py-2 text-[10px] font-bold uppercase tracking-[0.25em] transition-all ${
              mode === "signup" ? "gold-gradient text-[#3d2f00]" : "border border-on-surface/10 text-on-surface-variant hover:text-on-surface"
            }`}
            onClick={() => setMode("signup")}
            type="button"
          >
            Sign up
          </button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <label className="grid gap-2 text-sm text-on-surface-variant">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Full name</span>
              <input
                className="border border-on-surface/10 bg-surface-container-high text-on-surface px-4 py-3 outline-none transition focus:border-primary"
                onChange={(event) => setName(event.target.value)}
                required
                value={name}
              />
            </label>
          ) : null}

          <label className="grid gap-2 text-sm text-on-surface-variant">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Email</span>
            <input
              className="border border-on-surface/10 bg-surface-container-high text-on-surface px-4 py-3 outline-none transition focus:border-primary"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>

          <label className="grid gap-2 text-sm text-on-surface-variant">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Password</span>
            <input
              className="border border-on-surface/10 bg-surface-container-high text-on-surface px-4 py-3 outline-none transition focus:border-primary"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {mode === "signup" ? (
            <label className="grid gap-2 text-sm text-on-surface-variant">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Role</span>
              <select
                className="border border-on-surface/10 bg-surface-container-high text-on-surface px-4 py-3 outline-none transition focus:border-primary"
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
            <div className="border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          ) : null}

          <button
            className="gold-gradient text-[#3d2f00] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.3em] transition hover:scale-105 disabled:opacity-60"
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
