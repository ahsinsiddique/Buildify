import type { Metadata } from "next";

import { AuthProvider } from "@/components/auth/auth-provider";
import appConfig from "@/lib/app-config";

import "./globals.css";

export const metadata: Metadata = {
  title: `${appConfig.appName} ERP`,
  description: appConfig.description,
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
