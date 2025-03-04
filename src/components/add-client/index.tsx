import AddClient from "./add-client-form";
import { getGymSettings } from "@/lib/supabase/data";
import { GymSettings } from "@/types";

export default async function AddClientForm() {
  const data: GymSettings = (await getGymSettings()) || {
    gymPrices: [],
    id: "",
    name: "",
    hours: "",
  };
  return <AddClient data={data || null} />;
}
