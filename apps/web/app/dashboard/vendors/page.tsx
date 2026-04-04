import { ResourceManager } from "@/components/dashboard/resource-manager";
import { resourcePages } from "@/lib/resource-pages";

export default function VendorsPage() {
  return <ResourceManager {...resourcePages.vendors} />;
}
