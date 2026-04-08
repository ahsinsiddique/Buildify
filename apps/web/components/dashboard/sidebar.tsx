"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import appConfig from "@/lib/app-config";
import { navigationItems } from "@/lib/dashboard-data";

export function Sidebar() {
  const pathname = usePathname();
  const { session } = useAuth();
  const role = session?.user.role ?? "";

  // Filter nav items — show item if it has no role restriction or user matches
  const visibleItems = navigationItems.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  return (
    <aside className="w-full border-b border-on-surface/7 bg-surface-container-lowest p-5 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:border-on-surface/7">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Image
            src={appConfig.logoUrl}
            alt={appConfig.logoAlt}
            width={36}
            height={36}
            className="object-contain"
          />
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-on-surface/40 font-bold">
              {appConfig.appTag}
            </p>
            <h1 className="font-headline font-black text-xl tracking-tighter text-on-surface">
              {appConfig.appName}
            </h1>
          </div>
        </div>
        <p className="text-xs text-on-surface/30 leading-relaxed tracking-wide">
          Construction, property, CRM, and finance in one control panel.
        </p>
      </div>

      <nav className="grid gap-1">
        {visibleItems.map((item) => {
          const active = pathname === item.href;
          return (
            <div key={item.href}>
              {item.divider && (
                <div className="my-2 h-px bg-on-surface/8" />
              )}
              <Link
                href={item.href}
                className={`block px-4 py-3 text-[10px] font-bold uppercase tracking-[0.25em] transition-all ${
                  active
                    ? "gold-gradient text-[#3d2f00]"
                    : "text-on-surface/50 hover:bg-on-surface/5 hover:text-on-surface"
                }`}
              >
                {item.label}
              </Link>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
