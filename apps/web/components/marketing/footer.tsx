import Image from "next/image";
import Link from "next/link";

import appConfig from "@/lib/app-config";

const footerLinks = {
  Platform: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Projects", href: "/dashboard/projects" },
    { label: "Invoices", href: "/dashboard/invoices" },
    { label: "Workers", href: "/dashboard/workers" },
  ],
  Company: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Login", href: "/auth" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0e0e0e]">
      <div className="bg-[#1c1b1b]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 md:px-12 py-20 w-full max-w-7xl mx-auto">

          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src={appConfig.logoUrl}
                alt={appConfig.logoAlt}
                width={28}
                height={28}
                className="object-contain"
              />
              <span className="text-lg font-black text-gold font-headline uppercase tracking-tighter">
                {appConfig.appName}
              </span>
            </div>
            <p className="text-[#99907c] text-xs leading-relaxed max-w-xs uppercase tracking-wide">
              Construction and property operations in one unified system. Built for
              dealers, builders, and field teams.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="flex flex-col gap-4">
              <h5 className="text-gold text-xs tracking-widest uppercase mb-2 font-headline font-bold">
                {heading}
              </h5>
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[#99907c] text-xs tracking-widest uppercase hover:text-gold underline underline-offset-4 transition-opacity opacity-80 hover:opacity-100"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="px-8 md:px-12 py-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[#99907c] text-[10px] tracking-widest uppercase">
            © {new Date().getFullYear()} {appConfig.appName.toUpperCase()} ERP. ALL RIGHTS RESERVED.
          </p>
          <div className="h-px w-20 gold-gradient opacity-40" />
        </div>
      </div>
    </footer>
  );
}
