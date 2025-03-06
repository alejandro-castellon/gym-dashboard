import { Metadata } from "next";
import {
  getUser,
  getUserMemberships,
  getUserCheckins,
} from "@/lib/supabase/data";
import { Membership, User } from "@/types";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientInfo from "@/components/dashboard/client-info";
import AttendanceTracker from "@/components/dashboard/attendance-tracker";
import MembershipHistory from "@/components/dashboard/membership-history";
import { Attendance } from "@/types";

export const metadata: Metadata = {
  title: "Cliente",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user: User = await getUser(id);
  const memberships: Membership[] =
    (await getUserMemberships(user.email)) || [];
  const attendanceData: Attendance[] = await getUserCheckins(
    memberships.map((m) => m.id)
  );

  const isActive = () => {
    const currentDate = new Date();
    const endDate = new Date(memberships[0].end_date);
    // Convert dates to YYYY-MM-DD format
    const today = currentDate.toISOString().split("T")[0];
    const endDateString = endDate.toISOString().split("T")[0];
    return endDateString >= today;
  };

  return (
    <main className="space-y-6">
      <Card className="p-6">
        <ClientInfo client={user} isActive={isActive()} />
      </Card>

      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="attendance">Asistencias</TabsTrigger>
          <TabsTrigger value="memberships">Membresías</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance" className="mt-4">
          <Card className="p-6">
            <AttendanceTracker attendanceData={attendanceData} />
          </Card>
        </TabsContent>
        <TabsContent value="memberships" className="mt-4">
          <Card className="p-6">
            <MembershipHistory memberships={memberships} />
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
