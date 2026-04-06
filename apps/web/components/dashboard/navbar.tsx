"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";

export function Navbar() {
  const { logout, session } = useAuth();
  const router = useRouter();

  return (
    <header className="flex flex-col gap-4 border border-white/5 bg-surface-container px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-[9px] uppercase tracking-[0.4em] text-primary font-bold">Operations Center</p>
        <h2 className="mt-2 font-headline font-black text-2xl text-on-surface tracking-tight">
          Live cost tracking and project visibility
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
        <div className="border border-white/10 bg-surface-container-high px-4 py-2 text-[10px] uppercase tracking-[0.2em]">
          {session?.user.name} · {session?.user.role}
        </div>
        <div className="border border-white/10 bg-surface-container-high px-4 py-2 text-[10px] uppercase tracking-[0.2em]">
          3 invoice reminders
        </div>
        <div className="border border-white/10 bg-surface-container-high px-4 py-2 text-[10px] uppercase tracking-[0.2em]">
          1 budget alert
        </div>
        <button
          className="gold-gradient text-on-primary px-5 py-2 text-[10px] font-bold uppercase tracking-[0.25em] hover:scale-105 transition-transform"
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
