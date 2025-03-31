import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    const data = await resend.emails.send({
      from: 'ClubsManager <noreply@clubsmanager.com>',
      to: ['alejandrocastellonfer@gmail.com'],
      subject: `Nuevo mensaje de contacto de ${name}`,
      text: `Email: ${email}\n\nMensaje: ${message}`,
    });

    if (data.error) throw new Error(data.error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al enviar el email' + error },
      { status: 500 }
    );
  }
} 