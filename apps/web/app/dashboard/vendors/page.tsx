import appConfig from "@/lib/app-config";
import { ResourceManager } from "@/components/dashboard/resource-manager";
import { resourcePages } from "@/lib/resource-pages";

export const metadata = {
  title: `Vendors | ${appConfig.appName} ERP`,
  description: "Maintain supplier and contractor relationships.",
};

export default function VendorsPage() {
  return <ResourceManager {...resourcePages.vendors} />;
}
