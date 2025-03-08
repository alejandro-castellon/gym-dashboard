import { Metadata } from "next";
import MembershipTable from "@/components/members/get-data";

export const metadata: Metadata = {
  title: "Miembros",
};

export default async function Page() {
  return (
    <main>
      <h1 className="text-2xl font-medium">Miembros</h1>
      <MembershipTable />
    </main>
  );
}
