"use server";

import { encodedRedirect } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else if (
    data.user &&
    data.user.identities &&
    data.user.identities.length == 0
  ) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "There is already an account associated with this email address."
    );
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "Contraseña incorrecta. Intente nuevamente."
    );
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/api/auth/callback?redirect_to=/dashboard/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/dashboard/reset-password", "Password updated");
};

export const updateEmailAction = async (formData: FormData) => {
  const supabase = await createClient();
  const email = formData.get("email")?.toString();

  if (!email) {
    return encodedRedirect(
      "error",
      "/dashboard/profile",
      "El email es requerido"
    );
  }

  const { error } = await supabase.auth.updateUser({ email: email });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/dashboard/update-email",
      "No se pudo actualizar el email"
    );
  }

  return encodedRedirect(
    "success",
    "/dashboard/update-email",
    "Email actualizado correctamente. Revisa tu correo para confirmar el cambio."
  );
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const updateProfile = async (formData: FormData) => {
  const supabase = await createClient();
  const name = formData.get("name")?.toString();
  const ci = formData.get("ci")?.toString();
  const fecha_nacimiento = formData.get("fecha_nacimiento")?.toString();

  // Validar campos
  if (!name || !ci || !fecha_nacimiento) {
    return encodedRedirect(
      "error",
      "/dashboard/profile",
      "Todos los campos son obligatorios"
    );
  }

  // Convertir la fecha de nacimiento a formato Date si es necesario
  const birthDate = new Date(fecha_nacimiento);
  if (isNaN(birthDate.getTime())) {
    return encodedRedirect(
      "error",
      "/dashboard/profile",
      "Fecha de nacimiento no válida"
    );
  }

  // Obtener el usuario autenticado
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return encodedRedirect(
      "error",
      "/dashboard/profile",
      "Usuario no encontrado"
    );
  }

  // Actualizar el perfil en la base de datos
  const { error } = await supabase
    .from("users")
    .update({ name, ci, fecha_nacimiento: birthDate.toISOString() })
    .eq("id", user.user.id);

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/dashboard/profile",
      "No se pudo actualizar el perfil"
    );
  }

  return encodedRedirect(
    "success",
    "/dashboard/profile",
    "Perfil actualizado correctamente"
  );
};

export const updateGymData = async (formData: FormData) => {
  const supabase = await createClient();
  const name = formData.get("name")?.toString();

  // Obtener los horarios de apertura y cierre
  const gym_hours = [...formData.entries()]
    .filter(([key]) => key.endsWith("_open") || key.endsWith("_close"))
    .reduce((acc, [key, value]) => {
      const [day, type] = key.split("_");
      if (!acc[day]) acc[day] = { open: "", close: "" };
      acc[day][type as "open" | "close"] = value.toString() ?? "";
      return acc;
    }, {} as Record<string, { open: string; close: string }>);

  // Validar campos
  if (!name || Object.keys(gym_hours).length === 0) {
    return encodedRedirect(
      "error",
      "/dashboard/settings",
      "Todos los campos son obligatorios"
    );
  }

  // Obtener el usuario autenticado
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return encodedRedirect(
      "error",
      "/dashboard/settings",
      "Usuario no encontrado"
    );
  }

  // Actualizar el gimnasio en la base de datos
  const { error } = await supabase
    .from("gyms")
    .update({ name, hours: gym_hours })
    .contains("admin_ids", [user.user.id])
    .single();

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/dashboard/settings",
      "No se pudo actualizar los datos"
    );
  }

  return encodedRedirect(
    "success",
    "/dashboard/settings",
    "Gimnasio actualizado correctamente"
  );
};

export const createMembership = async (formData: FormData) => {
  const supabase = await createClient();

  const email = formData.get("email")?.toString();
  const start_date = formData.get("start_date")?.toString();
  const end_date = formData.get("end_date")?.toString();
  const price = formData.get("price")?.toString();

  // Validar campos
  if (!email || !start_date || !end_date || !price) {
    return encodedRedirect(
      "error",
      "/dashboard/add-client",
      "Todos los campos son obligatorios"
    );
  }

  // Obtener el usuario autenticado (admin)
  const { data: authUser, error: authUserError } =
    await supabase.auth.getUser();
  if (authUserError || !authUser?.user) {
    return encodedRedirect(
      "error",
      "/dashboard/add-client",
      "Usuario administrador no autenticado"
    );
  }

  // Obtener el gimnasio del administrador
  const { data: gym, error: gymError } = await supabase
    .from("gyms")
    .select("id")
    .contains("admin_ids", [authUser.user.id])
    .single();
  if (gymError || !gym) {
    return encodedRedirect(
      "error",
      "/dashboard/add-client",
      "No se encontró el gimnasio del administrador"
    );
  }

  // Insertar la membresía
  const { error: insertError } = await supabase.from("memberships").insert({
    user_email: email,
    gym_id: gym.id,
    start_date,
    end_date,
    price: parseFloat(price),
  });

  if (insertError) {
    console.error(insertError.message);
    return encodedRedirect(
      "error",
      "/dashboard/add-client",
      "No se pudo crear la membresía"
    );
  }

  return encodedRedirect(
    "success",
    "/dashboard/add-client",
    "Membresía creada correctamente"
  );
};
