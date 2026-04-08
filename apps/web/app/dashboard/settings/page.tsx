import type { Metadata } from "next";

import { SettingsPage } from "@/components/settings/settings-page";
import appConfig from "@/lib/app-config";

export const metadata: Metadata = {
  title: `Settings — ${appConfig.appName} ERP`,
};

export default function Page() {
  return <SettingsPage />;
}
