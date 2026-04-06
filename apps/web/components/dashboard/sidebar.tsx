"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import appConfig from "@/lib/app-config";
import { navigationItems } from "@/lib/dashboard-data";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-white/5 bg-[#050505] p-5 text-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:border-white/5">
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
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/40 font-bold">{appConfig.appTag}</p>
            <h1 className="font-headline font-black text-xl tracking-tighter text-white">{appConfig.appName}</h1>
          </div>
        </div>
        <p className="text-xs text-white/30 leading-relaxed tracking-wide">
          Construction, property, CRM, and finance in one control panel.
        </p>
      </div>

      <nav className="grid gap-1">
        {navigationItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-3 text-[10px] font-bold uppercase tracking-[0.25em] transition-all ${
                active
                  ? "bg-primary text-on-primary"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
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
