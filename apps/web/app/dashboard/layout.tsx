import { AuthGuard } from "@/components/auth/auth-guard";
import { Navbar } from "@/components/dashboard/navbar";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="min-h-screen lg:flex">
        <Sidebar />
        <div className="flex-1 px-5 py-5 lg:px-8">
          <Navbar />
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </AuthGuard>
  );
}
