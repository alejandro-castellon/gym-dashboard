"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/members/data-table";
import { getActiveGymMemberships } from "@/lib/supabase/data";
import { columns } from "@/components/members/columns";
import { Membership } from "@/types";
import { useUser } from "@/context/UserContext";
import { DataTableSkeleton } from "@/components/ui/skeletons";

export default function MembershipTable() {
  const { gymId } = useUser();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gymId) return;

    const fetchData = async () => {
      setLoading(true);
      const data = await getActiveGymMemberships(gymId);
      setMemberships(data);
      setLoading(false);
    };

    fetchData();
  }, [gymId]);

  if (loading) return <DataTableSkeleton />;

  return <DataTable columns={columns} data={memberships} />;
}
