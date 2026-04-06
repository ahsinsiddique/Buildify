import appConfig from "@/lib/app-config";
import { IntelligenceHub } from "@/components/dashboard/intelligence-hub";

export const metadata = {
  title: `AI Intelligence | ${appConfig.appName} ERP`,
  description: "AI-powered project risk analysis and cost insights.",
};

export default function IntelligencePage() {
  return <IntelligenceHub />;
}
