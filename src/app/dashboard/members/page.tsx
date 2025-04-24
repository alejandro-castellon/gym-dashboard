import { Metadata } from "next";
import MembersTable from "@/components/members/get-data";
import MembershipsTable from "@/components/members/memberships/get-data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Membresías",
};

export default async function Page() {
  return (
    <main>
      <div className="flex flex-col py-4">
        <h1 className="text-2xl font-medium">Membresías</h1>
        <p className="text-muted-foreground">
          Aquí puedes ver todas las membresías registradas.
        </p>
      </div>
      <Tabs defaultValue="active" className="w-full pt-4">
        <TabsList className="grid w-full grid-cols-2 bg-primary/10">
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-primary/80 data-[state=active]:text-white"
          >
            Membresías activas
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary/80 data-[state=active]:text-white"
          >
            Todas las membresías
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-0">
          <MembersTable />
        </TabsContent>
        <TabsContent value="all" className="mt-0">
          <MembershipsTable />
        </TabsContent>
      </Tabs>
    </main>
  );
}
