import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import NumericKeypad from "./numeric-keypad";
import NameSearch from "./name-search";

export default function CheckInInterface() {
  return (
    <Card className="overflow-hidden bg-[#102836]">
      <Tabs defaultValue="code" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#102836]/50">
          <TabsTrigger
            value="code"
            className="data-[state=active]:bg-[#1e4e5f] data-[state=active]:text-white"
          >
            Buscar por Ci
          </TabsTrigger>
          <TabsTrigger
            value="search"
            className="data-[state=active]:bg-[#1e4e5f] data-[state=active]:text-white"
          >
            Buscar por Nombre
          </TabsTrigger>
        </TabsList>
        <div className="p-6">
          <h1 className="mb-8 text-center text-3xl font-bold text-white">
            Check-In
          </h1>
          <TabsContent value="code" className="mt-0">
            <div className="space-y-8">
              <NumericKeypad />
            </div>
          </TabsContent>
          <TabsContent value="search" className="mt-0">
            <NameSearch />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}
