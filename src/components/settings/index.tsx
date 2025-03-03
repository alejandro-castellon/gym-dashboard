import Settings from "./form";
import { getGymSettings } from "@/lib/supabase/data";
import { GymSettings } from "@/types";

export default async function SettingsForm() {
  const data: GymSettings = (await getGymSettings()) || {
    gymPrices: [],
    id: "",
    name: "",
    hours: "",
  };
  return <Settings data={data} />;
}
