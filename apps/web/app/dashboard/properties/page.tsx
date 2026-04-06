import appConfig from "@/lib/app-config";
import { ResourceManager } from "@/components/dashboard/resource-manager";
import { resourcePages } from "@/lib/resource-pages";

export const metadata = {
  title: `Properties | ${appConfig.appName} ERP`,
  description: "Manage your property portfolio and plot inventory.",
};

export default function PropertiesPage() {
  return <ResourceManager {...resourcePages.properties} />;
}
