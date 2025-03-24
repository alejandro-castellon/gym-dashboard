"use client";

import { useState, useEffect } from "react";
import AddMember from "./add-member-form";
import { getGymSettings, getAllGymMember } from "@/lib/supabase/data";
import { GymSettings } from "@/types";
import { useUser } from "@/context/UserContext";
import { AddClientSkeleton } from "@/components/ui/skeletons";

export default function AddMemberForm() {
  const { gymId } = useUser();
  const [gymSettings, setGymSettings] = useState<GymSettings | null>(null);
  const [members, setMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gymId) return;
    const fetchData = async () => {
      setLoading(true);
      const gymSettings = await getGymSettings(gymId);
      const members = await getAllGymMember(gymId);
      setMembers(members);
      setGymSettings(gymSettings);
      setLoading(false);
    };
    fetchData();
  }, [gymId]);

  if (loading) return <AddClientSkeleton />;
  if (!gymSettings) return <p>No gym settings available</p>;
  return <AddMember gymSettings={gymSettings} members={members} />;
}
