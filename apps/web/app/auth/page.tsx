import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-600">Loading authentication...</div>}>
      <AuthForm />
    </Suspense>
  );
}
