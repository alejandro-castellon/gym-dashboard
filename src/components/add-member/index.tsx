"use client";

import { useState, useEffect } from "react";
import AddMember from "./add-member-form";
import { getGymSettings } from "@/lib/supabase/data";
import { GymSettings } from "@/types";
import { useUser } from "@/context/UserContext";
import { AddClientSkeleton } from "@/components/ui/skeletons";

export default function AddMemberForm() {
  const { gymId } = useUser();
  const [gymSettings, setGymSettings] = useState<GymSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gymId) return;
    const fetchData = async () => {
      setLoading(true);
      const data = await getGymSettings(gymId);
      setGymSettings(data);
      setLoading(false);
    };
    fetchData();
  }, [gymId]);

  if (loading) return <AddClientSkeleton />;
  if (!gymSettings) return <p>No gym settings available</p>;
  return <AddMember data={gymSettings} />;
}
