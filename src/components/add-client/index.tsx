import AddClient from "./add-client-form";
import { getUserGyms } from "@/lib/supabase/data";
import { Gym } from "@/types";

export default async function AddClientForm() {
  const gym: Gym = await getUserGyms();
  return <AddClient data={gym || null} />;
}
