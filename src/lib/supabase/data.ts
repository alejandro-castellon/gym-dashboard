import { createClient } from "@/lib/supabase/server";

export const getUserGyms = async () => {
  const supabase = await createClient();

  // Obtener el usuario autenticado
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.user) {
    throw new Error("Usuario no autenticado");
  }

  // Obtener los gimnasios del usuario
  const { data } = await supabase
    .from("gyms")
    .select("*")
    .contains("admin_ids", [user.user.id])
    .single(); // Verifica si el usuario está en admin_ids

  if (!data || data.length === 0) {
    return null;
  }

  return data;
};

export const getUserMembership = async () => {
  const supabase = await createClient();

  // Obtener el usuario autenticado
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.user) {
    throw new Error("Usuario no autenticado");
  }

  // Obtener la membresía del usuario, junto con el nombre del gimnasio asociado
  const { data, error } = await supabase
    .from("memberships")
    .select("*, gyms(name, hours, is_open)")
    .eq("user_email", user.user.email)
    .single();

  if (!data) {
    return null;
  }

  if (error) {
    throw new Error(`Error al obtener la membresía: ${error.message}`);
  }

  return data; // Aquí obtendrás la membresía con el nombre del gimnasio
};

export const getGymMemberships = async () => {
  const supabase = await createClient();

  // Obtener el usuario autenticado
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.user) {
    throw new Error("Usuario no autenticado");
  }

  const { data: gym, error: gymError } = await supabase
    .from("gyms")
    .select("id")
    .contains("admin_ids", [user.user.id])
    .single();
  if (gymError || !gym.id) {
    throw new Error("Gym no encontrado");
  }

  // Obtener la membresía del usuario
  const { data } = await supabase
    .from("memberships")
    .select("*, users:users(name, ci)")
    .eq("gym_id", gym.id);

  if (!data) {
    return null;
  }

  return data; // Aquí obtendrás la membresía con el nombre del gimnasio
};

export const getUserRole = async () => {
  const supabase = await createClient();

  // Obtener el usuario autenticado
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.user) {
    throw new Error("Usuario no autenticado");
  }

  // Obtener el rol del usuario
  const { data, error } = await supabase
    .from("users")
    .select("admin")
    .eq("id", user.user.id)
    .single();

  if (error) {
    throw new Error(`Error al obtener el rol del usuario: ${error.message}`);
  }

  return data.admin; // true si es admin, false si es usuario normal
};
