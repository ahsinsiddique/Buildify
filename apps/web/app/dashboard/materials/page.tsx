import appConfig from "@/lib/app-config";
import { ResourceManager } from "@/components/dashboard/resource-manager";
import { resourcePages } from "@/lib/resource-pages";

export const metadata = {
  title: `Materials | ${appConfig.appName} ERP`,
  description: "Track material inventory, pricing, and stock levels.",
};

export default function MaterialsPage() {
  return <ResourceManager {...resourcePages.materials} />;
}
