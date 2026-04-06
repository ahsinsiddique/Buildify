import appConfig from "@/lib/app-config";
import { ResourceManager } from "@/components/dashboard/resource-manager";
import { resourcePages } from "@/lib/resource-pages";

export const metadata = {
  title: `Expenses | ${appConfig.appName} ERP`,
  description: "Log and categorize all project costs and expenditures.",
};

export default function ExpensesPage() {
  return <ResourceManager {...resourcePages.expenses} />;
}
