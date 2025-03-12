import { Metadata } from "next";
import AddMemberForm from "@/components/add-member";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormMessage, Message } from "@/components/auth/form-message";

export const metadata: Metadata = {
  title: "Agregar miembro",
};

export default async function page(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <main>
      <h1 className="text-2xl font-medium mb-4">Crear membresía</h1>
      <Card className="md:w-2/5">
        <CardHeader>
          <CardTitle>Agregar miembro</CardTitle>
          <CardDescription>
            Introduce la información del miembro.
          </CardDescription>
        </CardHeader>
        <AddMemberForm />
        <CardFooter>
          <FormMessage message={searchParams} />
        </CardFooter>
      </Card>
    </main>
  );
}
