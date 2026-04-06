import appConfig from "@/lib/app-config";
import { InvoicesManager } from "@/components/dashboard/invoices-manager";

export const metadata = {
  title: `Invoices | ${appConfig.appName} ERP`,
  description: "Manage billing, track payments, and view invoice details.",
};

export default function InvoicesPage() {
  return <InvoicesManager />;
}
