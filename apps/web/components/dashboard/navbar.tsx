"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";

export function Navbar() {
  const { logout, session } = useAuth();
  const router = useRouter();

  return (
    <header className="flex flex-col gap-4 rounded-[1.5rem] border border-black/10 bg-white/70 px-5 py-4 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-moss">Operations Center</p>
        <h2 className="mt-2 font-display text-3xl text-ink">
          Live cost tracking and project visibility
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
        <div className="rounded-full border border-black/10 bg-white px-4 py-2">
          {session?.user.name} · {session?.user.role}
        </div>
        <div className="rounded-full border border-black/10 bg-white px-4 py-2">
          3 invoice reminders
        </div>
        <div className="rounded-full border border-black/10 bg-white px-4 py-2">
          1 budget alert
        </div>
        <div className="rounded-full border border-black/10 bg-white px-4 py-2">
          Site review at 4:00 PM
        </div>
        <button
          className="rounded-full bg-ink px-4 py-2 text-white"
          onClick={() => {
            logout();
            router.replace("/auth");
          }}
          type="button"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
