import { WorkerManagement } from "@/components/dashboard/worker-management";

export const metadata = {
  title: "Smart Worker Management | Property App",
  description: "Track attendance, salaries, and productivity.",
};

export default function WorkersPage() {
  return <WorkerManagement />;
}
