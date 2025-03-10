import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProfileData from "@/components/profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perfil",
};

export default function Profile() {
  return (
    <Card className="md:w-2/5">
      <CardHeader>
        <CardTitle>Mi información</CardTitle>
        <CardDescription>Aqui podras editar tu información.</CardDescription>
      </CardHeader>
      <ProfileData />
    </Card>
  );
}
