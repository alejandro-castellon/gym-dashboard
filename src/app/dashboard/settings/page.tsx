import { Suspense } from "react";
import { Metadata } from "next";
import SettingsForm from "@/components/settings";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormMessage, Message } from "@/components/auth/form-message";
import SettingsDataSkeleton from "@/components/settings/skeleton";

export const metadata: Metadata = {
  title: "Configuración",
};

export default async function page(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <Card className="md:w-2/5">
      <CardHeader>
        <CardTitle>Configuración</CardTitle>
        <CardDescription>Edita la información de tu gimnasio.</CardDescription>
      </CardHeader>

      <Suspense fallback={<SettingsDataSkeleton />}>
        <SettingsForm />
      </Suspense>

      <CardFooter>
        <FormMessage message={searchParams} />
      </CardFooter>
    </Card>
  );
}
