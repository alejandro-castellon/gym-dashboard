import SettingsData from "./data";
import { getUserGyms } from "@/lib/supabase/data";
import { Gym } from "@/types";

export default async function SettingsForm() {
  const gym: Gym = await getUserGyms();
  return <SettingsData data={gym || null} />;
}
