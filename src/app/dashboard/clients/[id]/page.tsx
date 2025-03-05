import { Metadata } from "next";
import { getUser, getUserMemberships } from "@/lib/supabase/data";
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

const attendanceData: Attendance[] = [
  {
    id: "1",
    date: "2025-03-01",
    checkIn: "08:30",
  },
  {
    id: "2",
    date: "2025-03-03",
    checkIn: "17:45",
  },
  {
    id: "3",
    date: "2025-03-05",
    checkIn: "16:00",
  },
  {
    id: "4",
    date: "2025-03-07",
    checkIn: "07:15",
  },
  {
    id: "5",
    date: "2025-03-10",
    checkIn: "18:30",
  },
  {
    id: "6",
    date: "2025-03-12",
    checkIn: "16:45",
  },
  {
    id: "7",
    date: "2025-03-14",
    checkIn: "08:00",
  },
  {
    id: "8",
    date: "2025-03-17",
    checkIn: "17:30",
  },
  {
    id: "9",
    date: "2025-03-19",
    checkIn: "16:15",
  },
  {
    id: "10",
    date: "2025-03-21",
    checkIn: "07:45",
  },
  {
    id: "11",
    date: "2025-03-24",
    checkIn: "18:00",
  },
  {
    id: "12",
    date: "2025-03-26",
    checkIn: "16:30",
  },
  {
    id: "13",
    date: "2025-03-28",
    checkIn: "08:15",
  },
  {
    id: "14",
    date: "2025-03-31",
    checkIn: "17:00",
  },
];

export default async function Page(props: { params: { id: string } }) {
  const getParams = async () => props.params;
  const { id } = await getParams();
  const user: User = await getUser(id);
  const memberships: Membership[] =
    (await getUserMemberships(user.email)) || [];
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
