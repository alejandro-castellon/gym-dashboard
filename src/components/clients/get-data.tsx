import { DataTable } from "@/components/clients/data-table";
import { getActiveGymMemberships } from "@/lib/supabase/data";
import { columns } from "@/components/clients/columns";
import { Membership } from "@/types";

export default async function MembershipTable() {
  const memberships: Membership[] = (await getActiveGymMemberships()) || [];
  return <DataTable columns={columns} data={memberships || []} />;
}
