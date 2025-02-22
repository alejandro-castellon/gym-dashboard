import React from "react";
import { Metadata } from "next";
import SettingsForm from "@/components/dashboard/gyms/settings";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormMessage, Message } from "@/components/auth/form-message";

export const metadata: Metadata = {
  title: "Configuración",
};

export default async function page(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <Card className="md:w-1/3">
      <CardHeader>
        <CardTitle>Configuración</CardTitle>
        <CardDescription>Edita la información de tu gimnasio.</CardDescription>
      </CardHeader>
      <SettingsForm />
      <CardFooter>
        <FormMessage message={searchParams} />
      </CardFooter>
    </Card>
  );
}
