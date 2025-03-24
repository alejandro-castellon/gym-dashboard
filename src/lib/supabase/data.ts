"use server";
import { createClient } from "@/lib/supabase/server";
import { User, Gym, GymSettings, Membership, Attendance } from "@/types";

const getAuthenticatedUser = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    throw new Error("Usuario no autenticado");
  }
  return data.user;
};

export const getUser = async (id: string): Promise<User> => {
  const supabase = await createClient();
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
export const getUserGyms = async (userId: string): Promise<Gym> => {
  const supabase = await createClient();

  // Obtener los gimnasios del usuario
  const { data } = await supabase
    .from("gyms")
    .select("*")
    .contains("admin_ids", [userId])
    .single(); // Verifica si el usuario está en admin_ids

  if (!data || data.length === 0) {
    throw new Error("Gym no encontrado");
  }

  return data;
};

export const getUserMemberships = async (
  email: string
): Promise<Membership[]> => {
  const supabase = await createClient();
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
  const supabase = await createClient();
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
  const supabase = await createClient();
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

export const getActiveGymMemberships = async (
  gymId: number
): Promise<Membership[]> => {
  const supabase = await createClient();

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

export const getAllGymMemberships = async (
  gymId: number
): Promise<Membership[]> => {
  const supabase = await createClient();

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

export const getAllGymMember = async (gymId: number): Promise<string[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("memberships")
    .select("user_email")
    .eq("gym_id", gymId);

  if (error || !data) {
    return [];
  }

  // Filtrar valores únicos
  const uniqueEmails = [...new Set(data.map((member) => member.user_email))];

  return uniqueEmails;
};

export const getRecentGymCheckins = async (): Promise<Attendance[]> => {
  const supabase = await createClient();

  const user = await getAuthenticatedUser();

  // Obtener los gimnasios del usuario
  const { data: gym } = await supabase
    .from("gyms")
    .select("id")
    .contains("admin_ids", [user.id])
    .single(); // Verifica si el usuario está en admin_ids

  if (!gym) {
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

export const checkIfAlreadyCheckedIn = async (
  membershipId: number
): Promise<boolean> => {
  const supabase = await createClient();
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];

  // Buscar registros de asistencia de hoy
  const { data, error } = await supabase
    .from("attendances")
    .select("id, date")
    .eq("membership_id", membershipId)
    .gte("date", localDate);

  if (error) {
    console.error("Error al verificar asistencia:", error);
    return false;
  }

  return data.length > 0; // Retorna `true` si ya hay un registro de hoy
};

export const getGymSettings = async (gymId: number): Promise<GymSettings> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gyms")
    .select("id, name, hours, gym_prices(*)")
    .eq("id", gymId)
    .single();

  if (error || !data) {
    throw new Error("Error al obtener los datos del gimnasio");
  }

  return {
    ...data,
    gymPrices: data.gym_prices ?? [], // Asegura que sea un array vacío si no hay precios
  };
};

export const getUserRole = async () => {
  const supabase = await createClient();
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
