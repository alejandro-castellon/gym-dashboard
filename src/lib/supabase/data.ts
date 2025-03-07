"use server";
import { createClient } from "@/lib/supabase/server";
import { User, Gym, GymSettings, Membership, Attendance } from "@/types";

// Crear una instancia única del cliente supabase
const supabasePromise = createClient();

const getAuthenticatedUser = async () => {
  const supabase = await supabasePromise;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    throw new Error("Usuario no autenticado");
  }
  return data.user;
};

const getGymId = async () => {
  const supabase = await supabasePromise;
  // Obtener el usuario autenticado
  const user = await getAuthenticatedUser();

  // Obtener el gimnasio del usuario
  const { data: gym, error: gymError } = await supabase
    .from("gyms")
    .select("id")
    .contains("admin_ids", [user.id])
    .single();
  if (gymError || !gym) {
    throw new Error("Gym no encontrado");
  }
  return gym.id;
};

export const getUser = async (id: string): Promise<User> => {
  const supabase = await supabasePromise;
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single(); // Verifica si el usuario esta

  if (!data || data.length === 0) {
    throw new Error("Usuario no encontrado");
  }

  return data;
};
export const getUserGyms = async (): Promise<Gym> => {
  const supabase = await supabasePromise;
  // Obtener el usuario autenticado
  const user = await getAuthenticatedUser();

  // Obtener los gimnasios del usuario
  const { data } = await supabase
    .from("gyms")
    .select("*")
    .contains("admin_ids", [user.id])
    .single(); // Verifica si el usuario está en admin_ids

  if (!data || data.length === 0) {
    throw new Error("Gym no encontrado");
  }

  return data;
};

export const getUserMemberships = async (
  email: string
): Promise<Membership[]> => {
  const supabase = await supabasePromise;
  // Obtener la membresía del usuario, junto con el nombre del gimnasio asociado
  const { data } = await supabase
    .from("memberships")
    .select("*, gyms(name, hours, is_open)")
    .eq("user_email", email)
    .order("end_date", { ascending: false });
  if (!data) {
    return [];
  }

  return data; // Aquí obtendrás la membresía con el nombre del gimnasio
};

export const getUserCheckins = async (
  memberships: number[]
): Promise<Attendance[]> => {
  const supabase = await supabasePromise;
  const { data, error } = await supabase
    .from("attendances")
    .select("*")
    .in("membership_id", memberships)
    .order("check_in", { ascending: false });

  if (error) {
    console.error("Error al obtener las asistencias:", error.message);
    return [];
  }

  return data;
};

export const getActiveUserMembership = async (): Promise<Membership> => {
  const supabase = await supabasePromise;
  // Obtener el usuario autenticado
  const user = await getAuthenticatedUser();

  // Obtener la membresía del usuario
  const { data } = await supabase
    .from("active_memberships")
    .select("*, gyms(name, hours, is_open)")
    .eq("user_email", user.email)
    .single();

  if (!data) {
    return {} as Membership;
  }

  return data;
};

export const getActiveGymMemberships = async (): Promise<Membership[]> => {
  const supabase = await supabasePromise;
  // Obtener el gimnasio del usuario
  const gymId = await getGymId();

  // Obtener la membresía del usuario
  const { data } = await supabase
    .from("active_memberships")
    .select("*, users:users(id, name, ci)")
    .eq("gym_id", gymId)
    .order("start_date", { ascending: true });

  if (!data) {
    return [];
  }

  return data;
};

export const getAllGymMemberships = async (): Promise<Membership[]> => {
  const supabase = await supabasePromise;
  // Obtener el gimnasio del usuario
  const gymId = await getGymId();

  // Obtener la membresía del usuario
  const { data } = await supabase
    .from("memberships")
    .select("*, users:users(id, name, ci)")
    .eq("gym_id", gymId)
    .order("start_date", { ascending: false });

  if (!data) {
    return [];
  }

  return data;
};

export const getRecentGymCheckins = async (): Promise<Attendance[]> => {
  const supabase = await supabasePromise;
  // Obtener el gimnasio del usuario
  const gymId = await getGymId();

  const { data, error } = await supabase.rpc("get_recent_gym_checkins", {
    gymid: gymId,
  });

  if (error) {
    console.error("Error al obtener las asistencias:", error);
    return [];
  }

  return data;
};

export const checkIfAlreadyCheckedIn = async (
  membershipId: number
): Promise<boolean> => {
  const supabase = await supabasePromise;

  // Buscar registros de asistencia de hoy
  const { data, error } = await supabase
    .from("attendances")
    .select("id, date")
    .eq("membership_id", membershipId)
    .gte("date", new Date().toISOString().split("T")[0]);

  if (error) {
    console.error("Error al verificar asistencia:", error);
    return false;
  }

  return data.length > 0; // Retorna `true` si ya hay un registro de hoy
};

export const getGymSettings = async (): Promise<GymSettings> => {
  const supabase = await supabasePromise;
  // Obtener el usuario autenticado
  const user = await getAuthenticatedUser();

  // Obtener el gimnasio del usuario con solo name y hours
  const { data: gym, error: gymError } = await supabase
    .from("gyms")
    .select("id, name, hours")
    .contains("admin_ids", [user.id])
    .single();

  if (gymError || !gym) {
    return {} as GymSettings;
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
  const supabase = await supabasePromise;
  // Obtener el usuario autenticado
  const user = await getAuthenticatedUser();

  // Obtener el rol del usuario
  const { data, error } = await supabase
    .from("users")
    .select("id, admin")
    .eq("id", user.id)
    .single();

  if (error) {
    throw new Error(`Error al obtener el rol del usuario: ${error.message}`);
  }

  return data;
};
