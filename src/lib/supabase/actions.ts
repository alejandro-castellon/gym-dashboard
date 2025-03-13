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
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed"
    );
  }

  return encodedRedirect(
    "success",
    "/dashboard/reset-password",
    "Password updated"
  );
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
  const id = formData.get("id")?.toString();
  const phone = formData.get("phone")?.toString();
  const gender = formData.get("gender")?.toString();

  // Convertir la fecha de nacimiento a formato Date si es necesario
  if (!fecha_nacimiento) {
    return encodedRedirect(
      "error",
      "/dashboard/profile",
      "Fecha de nacimiento no válida"
    );
  }
  const birthDate = new Date(fecha_nacimiento);
  if (isNaN(birthDate.getTime())) {
    return encodedRedirect(
      "error",
      "/dashboard/profile",
      "Fecha de nacimiento no válida"
    );
  }

  // Actualizar el perfil en la base de datos
  const { error } = await supabase
    .from("users")
    .update({
      name,
      ci,
      fecha_nacimiento: birthDate.toISOString(),
      phone,
      gender,
    })
    .eq("id", id);

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
  const user_id = formData.get("id")?.toString();

  // Obtener los horarios de apertura y cierre
  const gym_hours = [...formData.entries()]
    .filter(([key]) => key.endsWith("_open") || key.endsWith("_close"))
    .reduce((acc, [key, value]) => {
      const [day, type] = key.split("_");
      if (!acc[day]) acc[day] = { open: "", close: "" };
      acc[day][type as "open" | "close"] = value.toString() ?? "";
      return acc;
    }, {} as Record<string, { open: string; close: string }>);

  // Obtener los precios de las membresías
  const gymPrices = [
    { membership_type_id: 1, price: formData.get("price_1") },
    { membership_type_id: 2, price: formData.get("price_2") },
    { membership_type_id: 3, price: formData.get("price_3") },
    { membership_type_id: 4, price: formData.get("price_4") },
    { membership_type_id: 5, price: formData.get("price_5") },
  ];

  // Validar campos
  if (!name || Object.keys(gym_hours).length === 0) {
    return encodedRedirect(
      "error",
      "/dashboard/settings",
      "Todos los campos son obligatorios"
    );
  }

  // Obtener los gimnasios del usuario
  const { data: gym } = await supabase
    .from("gyms")
    .select("*")
    .contains("admin_ids", [user_id])
    .single(); // Verifica si el usuario está en admin_ids

  // Actualizar el gimnasio en la base de datos
  const { error } = await supabase
    .from("gyms")
    .update({ name, hours: gym_hours })
    .eq("id", gym.id)
    .single();

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/dashboard/settings",
      "No se pudo actualizar los datos del gimnasio"
    );
  }

  // Crear o actualizar los precios de las membresías
  for (const { membership_type_id, price } of gymPrices) {
    const { error: priceError } = await supabase
      .from("gym_prices")
      .update({
        price: price, // Guardamos el precio como número
      })
      .eq("membership_type_id", membership_type_id)
      .eq("gym_id", gym.id);

    if (priceError) {
      console.error(priceError.message);
      return encodedRedirect(
        "error",
        "/dashboard/settings",
        "No se pudo actualizar los precios"
      );
    }
  }

  return encodedRedirect(
    "success",
    "/dashboard/settings",
    "Datos actualizados correctamente"
  );
};

export const createUserInSupabaseAuth = async (email: string) => {
  const origin = (await headers()).get("origin");

  if (!email) {
    return encodedRedirect(
      "error",
      "/dashboard/add-member",
      "Email es requerido"
    );
  }
  // Extraer la parte del nombre antes del @ para usar como contraseña
  const password = email.split("@")[0];

  const response = await fetch(`${origin}/api/createUser`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const result = await response.json();

  if (!response.ok) {
    return encodedRedirect("error", "/dashboard/add-member", result.error);
  }

  return encodedRedirect(
    "success",
    "/dashboard/add-member",
    "Usuario creado correctamente - Contraseña: " + password
  );
};

export const createMembership = async (formData: FormData) => {
  const supabase = await createClient();

  const email = formData.get("email")?.toString();
  const start_date = formData.get("start_date")?.toString();
  const end_date = formData.get("end_date")?.toString();
  const price = formData.get("price")?.toString();
  const gym_id = formData.get("gym_id")?.toString();
  const membership_type_id = formData.get("membership_type_id")?.toString();

  // Validar campos
  if (
    !email ||
    !start_date ||
    !end_date ||
    !price ||
    !gym_id ||
    !membership_type_id
  ) {
    return encodedRedirect(
      "error",
      "/dashboard/add-member",
      "Todos los campos son obligatorios"
    );
  }

  // Validar si ya existe una membresía para el mismo cliente y gimnasio en las mismas fechas
  const { data: existingMemberships, error: membershipError } = await supabase
    .from("active_memberships")
    .select("id")
    .eq("user_email", email)
    .eq("gym_id", gym_id)
    .or(`and(start_date.lte.${end_date}, end_date.gte.${start_date})`);
  if (membershipError) {
    console.error(membershipError.message);
    return encodedRedirect(
      "error",
      "/dashboard/add-member",
      "Error al verificar las membresías existentes"
    );
  }

  // Si existe una membresía en las mismas fechas, retornar error
  if (existingMemberships.length) {
    return encodedRedirect(
      "error",
      "/dashboard/add-member",
      "Ya existe una membresía activa en ese rango de fechas para este cliente"
    );
  }

  // Insertar la membresía
  const { error: insertError } = await supabase.from("memberships").insert({
    user_email: email,
    gym_id: gym_id,
    start_date,
    end_date,
    price: parseFloat(price),
    membership_type_id: parseInt(membership_type_id),
  });

  if (insertError) {
    console.error(insertError.message);
    return encodedRedirect(
      "error",
      "/dashboard/add-member",
      "No se pudo crear la membresía"
    );
  }

  return encodedRedirect(
    "success",
    "/dashboard/add-member",
    "Membresía creada correctamente"
  );
};

export const registerAttendance = async (
  membership_id: string,
  days_left: number
) => {
  const supabase = await createClient();
  // Insertar la membresía
  await supabase.from("attendances").insert({
    membership_id,
  });

  if (days_left === 1) {
    const today = new Date();
    const localDate = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

    const { error } = await supabase
      .from("memberships")
      .update({
        end_date: localDate,
      })
      .eq("id", membership_id);
    if (error) {
      console.error(error.message);
    }
  }
};

export const openGym = async (formData: FormData) => {
  const supabase = await createClient();
  const gym_id = formData.get("id")?.toString();
  const open = formData.get("is_open")?.toString();

  // Validar campos
  if (!open) {
    return encodedRedirect("error", "/dashboard", "Error");
  }

  // Actualizar el gimnasio en la base de datos
  const { error } = await supabase
    .from("gyms")
    .update({ is_open: open })
    .eq("id", gym_id)
    .single();

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/dashboard",
      "No se pudo abrir el gimnasio"
    );
  }

  return encodedRedirect("success", "/dashboard", "Cambio correctamente");
};
