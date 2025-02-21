import { createClient } from "@/lib/supabase/server";

export const getUserGyms = async () => {
  const supabase = await createClient();

  // Obtener el usuario autenticado
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.user) {
    throw new Error("Usuario no autenticado");
  }

  // Obtener los gimnasios del usuario
  const { data, error } = await supabase
    .from("gyms")
    .select("*")
    .eq("user_id", user.user.id)
    .single();

  if (error) {
    throw new Error(`Error al obtener los gimnasios: ${error.message}`);
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
    .select("*, gyms(name)")
    .eq("user_id", user.user.id)
    .single();

  if (error) {
    throw new Error(`Error al obtener la membresía: ${error.message}`);
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
