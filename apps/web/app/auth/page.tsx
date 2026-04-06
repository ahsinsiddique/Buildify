import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";
import { MarketingHeader } from "@/components/marketing/header";

export default function AuthPage() {
  return (
    <>
      <MarketingHeader />
      <Suspense fallback={<div className="p-8 text-slate-600">Loading authentication...</div>}>
        <AuthForm />
      </Suspense>
    </>
  );
}
