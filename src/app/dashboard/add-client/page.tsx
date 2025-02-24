import { Metadata } from "next";
import AddClientForm from "@/components/clients/add-client-form";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormMessage, Message } from "@/components/auth/form-message";

export const metadata: Metadata = {
  title: "Agregar cliente",
};

export default async function page(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <Card className="md:w-2/5">
      <CardHeader>
        <CardTitle>Agregar cliente</CardTitle>
        <CardDescription>Introduce la información del cliente.</CardDescription>
      </CardHeader>
      <AddClientForm />
      <CardFooter>
        <FormMessage message={searchParams} />
      </CardFooter>
    </Card>
  );
}
