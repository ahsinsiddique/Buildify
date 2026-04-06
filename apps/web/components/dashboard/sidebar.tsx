"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import appConfig from "@/lib/app-config";
import { navigationItems } from "@/lib/dashboard-data";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-black/10 bg-[linear-gradient(180deg,#10201f,#0f172a)] p-5 text-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Image
            src={appConfig.logoUrl}
            alt={appConfig.logoAlt}
            width={36}
            height={36}
            className="rounded-lg object-contain"
          />
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/55">{appConfig.appTag}</p>
            <h1 className="font-display text-xl leading-tight">{appConfig.appName}</h1>
          </div>
        </div>
        <p className="text-sm text-white/70">
          Construction, property, CRM, and finance in one control panel.
        </p>
      </div>

      <nav className="grid gap-2">
        {navigationItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-white text-ink shadow-sm"
                  : "text-white/78 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
