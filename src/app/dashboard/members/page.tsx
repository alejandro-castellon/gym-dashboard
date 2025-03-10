import { Metadata } from "next";
import MembersTable from "@/components/members/get-data";
import MembershipsTable from "@/components/members/memberships/get-data";
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export const metadata: Metadata = {
  title: "Membresías",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const params = await searchParams;
  const showMembers = params.view !== "memberships";

  return (
    <main>
      <h1 className="text-2xl font-medium mb-4">Membresías</h1>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-medium">
              {showMembers ? "Membresías activas" : "Todas las membresías"}
            </CardTitle>
            <CardDescription>
              {showMembers
                ? "Aquí puedes ver la lista de membresías activas."
                : "Aquí puedes ver todas las membresías registradas."}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Link
              href={`?view=${showMembers ? "memberships" : "members"}`}
              passHref
            >
              <Button>
                Ver{" "}
                {showMembers ? "Todas las membresías" : "Membresías activas"}
              </Button>
            </Link>
            <Link href="/dashboard/add-member" passHref>
              <Button type="button">
                <UserPlus />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {showMembers ? <MembersTable /> : <MembershipsTable />}
        </CardContent>
      </Card>
    </main>
  );
}
