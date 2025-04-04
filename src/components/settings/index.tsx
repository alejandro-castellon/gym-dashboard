"use client";

import { useState, useEffect } from "react";
import Settings from "./form";
import { getGymSettings } from "@/lib/supabase/data";
import { GymSettings } from "@/types";
import { useUser } from "@/context/UserContext";
import { SettingsDataSkeleton } from "@/components/ui/skeletons";

export default function SettingsForm() {
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

  if (loading) return <SettingsDataSkeleton />;
  if (!gymSettings) return <p>No gym settings available</p>;
  return <Settings data={gymSettings} />;
}
