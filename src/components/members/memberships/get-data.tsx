"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { getAllGymMemberships } from "@/lib/supabase/data";
import { columns } from "@/components/members/memberships/columns";
import { Membership } from "@/types";
import { useUser } from "@/context/UserContext";
import { DataTableSkeleton } from "@/components/ui/skeletons";

export default function MembershipsTable() {
  const { gymId } = useUser();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gymId) return;

    const fetchData = async () => {
      setLoading(true);
      const data = await getAllGymMemberships(gymId);
      setMemberships(data);
      setLoading(false);
    };

    fetchData();
  }, [gymId]);

  if (loading) return <DataTableSkeleton />;

  return <DataTable columns={columns} data={memberships} />;
}
