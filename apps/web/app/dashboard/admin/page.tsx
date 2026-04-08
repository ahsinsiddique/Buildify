import type { Metadata } from "next";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import appConfig from "@/lib/app-config";

export const metadata: Metadata = {
  title: `Admin Panel — ${appConfig.appName} ERP`,
};

export default function Page() {
  return <AdminDashboard />;
}
