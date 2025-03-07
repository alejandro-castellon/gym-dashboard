"use server";
import { createClient } from "@/lib/supabase/server";

export const getUser = async (id: string) => {
  const supabase = await createClient();

  // Obtener los gimnasios del usuario
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single(); // Verifica si el usuario está en admin_ids

  if (!data || data.length === 0) {
    return null;
  }

  return data;
};
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

export const getUserMemberships = async (email: string) => {
  const supabase = await createClient();

  // Obtener la membresía del usuario, junto con el nombre del gimnasio asociado
  const { data } = await supabase
    .from("memberships")
    .select("*, gyms(name, hours, is_open)")
    .eq("user_email", email)
    .order("end_date", { ascending: false });
  if (!data) {
    return null;
  }

  return data; // Aquí obtendrás la membresía con el nombre del gimnasio
};

export const getUserCheckins = async (memberships: number[]) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attendances")
    .select("*")
    .in("membership_id", memberships)
    .order("check_in", { ascending: false });

  if (error) {
    console.error("Error al obtener las asistencias:", error);
    return [];
  }

  return data;
};

export const getActiveUserMembership = async () => {
  const supabase = await createClient();

  // Obtener el usuario autenticado
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.user) {
    throw new Error("Usuario no autenticado");
  }

  // Obtener la membresía del usuario
  const { data } = await supabase
    .from("active_memberships")
    .select("*, gyms(name, hours, is_open)")
    .eq("user_email", user.user.email)
    .single();

  if (!data) {
    return null;
  }

  return data;
};

export const getActiveGymMemberships = async () => {
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
    .from("active_memberships")
    .select("*, users:users(id, name, ci)")
    .eq("gym_id", gym.id)
    .order("start_date", { ascending: true });

  if (!data) {
    return null;
  }

  return data;
};

export const getAllGymMemberships = async () => {
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
    .select("*, users:users(id, name, ci)")
    .eq("gym_id", gym.id)
    .order("start_date", { ascending: false });

  if (!data) {
    return null;
  }

  return data;
};

export const getRecentGymCheckins = async () => {
  const supabase = await createClient();

  // Obtener el usuario autenticado
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.user) {
    throw new Error("Usuario no autenticado");
  }

  // Obtener el gimnasio del usuario
  const { data: gym, error: gymError } = await supabase
    .from("gyms")
    .select("id")
    .contains("admin_ids", [user.user.id])
    .single();
  if (gymError || !gym.id) {
    throw new Error("Gym no encontrado");
  }

  const { data, error } = await supabase.rpc("get_recent_gym_checkins", {
    gymid: gym.id,
  });

  if (error) {
    console.error("Error al obtener las asistencias:", error);
    return [];
  }

  return data;
};

export const checkIfAlreadyCheckedIn = async (membershipId: number) => {
  const supabase = await createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Eliminar la hora para comparar solo la fecha

  // Buscar registros de asistencia de hoy
  const { data, error } = await supabase
    .from("attendances")
    .select("id, date")
    .eq("membership_id", membershipId)
    .gte("date", today.toISOString());

  if (error) {
    console.error("Error al verificar asistencia:", error);
    return false;
  }

  return data.length > 0; // Retorna `true` si ya hay un registro de hoy
};

export const getGymSettings = async () => {
  const supabase = await createClient();

  // Obtener el usuario autenticado
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.user) {
    throw new Error("Usuario no autenticado");
  }

  // Obtener el gimnasio del usuario con solo name y hours
  const { data: gym, error: gymError } = await supabase
    .from("gyms")
    .select("id, name, hours")
    .contains("admin_ids", [user.user.id])
    .single();

  if (gymError || !gym) {
    return null;
  }

  // Obtener los precios del gimnasio
  const { data: gymPrices, error: pricesError } = await supabase
    .from("gym_prices")
    .select("*")
    .eq("gym_id", gym.id);

  if (pricesError) {
    throw new Error("Error al obtener los precios del gimnasio");
  }

  return { ...gym, gymPrices };
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
    .select("id, admin")
    .eq("id", user.user.id)
    .single();

  if (error) {
    throw new Error(`Error al obtener el rol del usuario: ${error.message}`);
  }

  return data; // true si es admin, false si es usuario normal
};
