import { DataTable } from "@/components/clients/data-table";
import { getGymMemberships } from "@/lib/supabase/data";
import { columns } from "@/components/clients/columns";

export default async function MembershipTable() {
  const memberships = await getGymMemberships();
  return <DataTable columns={columns} data={memberships || []} />;
}
