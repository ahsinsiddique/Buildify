import { ResourceManager } from "@/components/dashboard/resource-manager";
import { resourcePages } from "@/lib/resource-pages";

export default function WorkersPage() {
  return <ResourceManager {...resourcePages.workers} />;
}
