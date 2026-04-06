import appConfig from "@/lib/app-config";
import { ResourceManager } from "@/components/dashboard/resource-manager";
import { resourcePages } from "@/lib/resource-pages";

export const metadata = {
  title: `Projects | ${appConfig.appName} ERP`,
  description: "Track construction projects, budgets, and timelines.",
};

export default function ProjectsPage() {
  return <ResourceManager {...resourcePages.projects} />;
}
