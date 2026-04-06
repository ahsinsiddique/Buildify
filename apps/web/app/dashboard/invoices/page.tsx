import { InvoicesManager } from "@/components/dashboard/invoices-manager";

export const metadata = {
  title: "Invoices | BrickFlow ERP",
  description: "Manage billing, track payments, and view invoice details.",
};

export default function InvoicesPage() {
  return <InvoicesManager />;
}
