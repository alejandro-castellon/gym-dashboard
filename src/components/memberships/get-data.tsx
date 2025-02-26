import { DataTable } from "@/components/clients/data-table";
import { getAllGymMemberships } from "@/lib/supabase/data";
import { columns } from "@/components/memberships/columns";
import { Membership } from "@/types";

export default async function MembershipTable() {
  const memberships: Membership[] = (await getAllGymMemberships()) || [];
  return <DataTable columns={columns} data={memberships || []} />;
}
