import Image from "next/image";
import Link from "next/link";

import appConfig from "@/lib/app-config";

const links: Record<string, { label: string; href: string }[]> = {
  Platform: [
    { label: "Projects", href: "/dashboard/projects" },
    { label: "Workers", href: "/dashboard/workers" },
    { label: "Invoices", href: "/dashboard/invoices" },
    { label: "Financial Hub", href: "/dashboard/financial" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Features", href: "/#features" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-32 pb-16 px-8 md:px-16">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-24 mb-32">
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-8">
              <Image
                src={appConfig.logoUrl}
                alt={appConfig.logoAlt}
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-2xl font-black text-white font-headline tracking-tighter uppercase">
                {appConfig.appName}
              </span>
            </Link>
            <p className="text-white/40 text-xs tracking-[0.2em] uppercase leading-loose font-bold max-w-xs">
              Construction, property, and workforce management. Built for builders.
            </p>
          </div>

          {Object.entries(links).map(([group, items]) => (
            <div key={group} className="flex flex-col gap-6">
              <h5 className="text-primary font-bold text-[10px] tracking-[0.4em] uppercase mb-4">{group}</h5>
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-white/60 text-[10px] tracking-[0.2em] uppercase hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-12" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/20 text-[9px] tracking-[0.5em] font-bold uppercase">
            © {new Date().getFullYear()} {appConfig.appName.toUpperCase()} ERP. All rights reserved.
          </p>
          <div className="flex gap-12">
            <Link href="#" className="text-white/20 text-[9px] tracking-[0.5em] font-bold uppercase hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-white/20 text-[9px] tracking-[0.5em] font-bold uppercase hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
