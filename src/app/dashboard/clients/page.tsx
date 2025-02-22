import { Metadata } from "next";
import { Suspense } from "react";
import { columns } from "@/components/dashboard/gyms/clients/columns";
import { DataTable } from "@/components/dashboard/gyms/clients/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { getGymMemberships } from "@/lib/supabase/data";
import { Membership } from "@/types";

export const metadata: Metadata = {
  title: "Clientes",
};

export default async function Page() {
  const memberships: Membership[] = (await getGymMemberships()) || [];

  return (
    <main>
      <h1>Clientes</h1>
      <Suspense
        fallback={<Skeleton className="h-[125px] w-[250px] rounded-xl" />}
      >
        <DataTable columns={columns} data={memberships} />
      </Suspense>
    </main>
  );
}
