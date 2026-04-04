"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "./auth-provider";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, isHydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isHydrated && !session) {
      router.replace(`/auth?next=${encodeURIComponent(pathname)}`);
    }
  }, [isHydrated, pathname, router, session]);

  if (!isHydrated || !session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-600">
        Checking your session...
      </div>
    );
  }

  return <>{children}</>;
}
