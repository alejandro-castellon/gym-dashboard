import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProfileData from "@/components/profile";
import { FormMessage, Message } from "@/components/auth/form-message";

export default async function Profile(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <Card className="md:w-1/3">
      <CardHeader>
        <CardTitle>Mi información</CardTitle>
        <CardDescription>Aqui podras editar tu información.</CardDescription>
      </CardHeader>
      <ProfileData />
    </Card>
  );
}
