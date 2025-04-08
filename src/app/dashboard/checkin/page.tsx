import { Metadata } from "next";
import CheckInInterface from "@/components/check-in/search";
import RecentCheckIns from "@/components/check-in/recent-checkins";

export const metadata: Metadata = {
  title: "Check-in",
};

export default function CheckInPage() {
  return (
    <main>
      <h1 className="text-2xl font-medium mb-4">Check-In</h1>
      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        <div className="lg:col-span-1">
          <CheckInInterface />
        </div>
        <div className="lg:col-span-2">
          <RecentCheckIns />
        </div>
      </div>
    </main>
  );
}
