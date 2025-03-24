import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email es requerido" },
        { status: 400 }
      );
    }

    // Extraer la parte del nombre antes del @ para usar como contraseña
    const password = email.split("@")[0];

    // Crear usuario con Service Role sin cambiar la sesión del admin
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Omitir verificación de email
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Enviar correo con las credenciales usando OTP
    const { error: emailError } = await supabaseAdmin.auth.signInWithOtp({
      email,
      options: {
        data: {
          password: password,
          type: "signup",
        },
      },
    });

    if (emailError) {
      console.error("Error al enviar el correo:", emailError);
      // No retornamos error ya que el usuario fue creado exitosamente
    }

    return NextResponse.json({
      success: "Usuario creado correctamente",
      user: data,
    });
  } catch (error) {
    console.error("Error en la API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
