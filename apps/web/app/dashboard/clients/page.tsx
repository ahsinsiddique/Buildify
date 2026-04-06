import appConfig from "@/lib/app-config";
import { ResourceManager } from "@/components/dashboard/resource-manager";
import { resourcePages } from "@/lib/resource-pages";

export const metadata = {
  title: `Clients | ${appConfig.appName} ERP`,
  description: "Manage client relationships and billing contacts.",
};

export default function ClientsPage() {
  return <ResourceManager {...resourcePages.clients} />;
}
