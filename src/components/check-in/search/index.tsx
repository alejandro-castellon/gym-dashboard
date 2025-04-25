"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import NumericKeypad from "./numeric-keypad";
import NameSearch from "./name-search";
import { getActiveGymMemberships } from "@/lib/supabase/data";
import { Membership } from "@/types";
import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";

export default function CheckInInterface() {
  const { gymId } = useUser();
  const [memberships, setMemberships] = useState<Membership[]>([]);

  useEffect(() => {
    if (!gymId) return;
    const fetchData = async () => {
      const data = await getActiveGymMemberships(gymId);
      setMemberships(data);
    };
    fetchData();
  }, [gymId]);

  return (
    <Card className="overflow-hidden bg-green-950">
      <Tabs defaultValue="code" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-primary/50">
          <TabsTrigger
            value="code"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Buscar por Ci
          </TabsTrigger>
          <TabsTrigger
            value="search"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Buscar por Nombre
          </TabsTrigger>
        </TabsList>
        <div className="p-6 pb-8">
          <h1 className="mb-8 text-center text-3xl font-bold text-white">
            Check-In
          </h1>
          <TabsContent value="code" className="mt-0">
            <div className="space-y-8">
              <NumericKeypad memberships={memberships} />
            </div>
          </TabsContent>
          <TabsContent value="search" className="mt-0">
            <NameSearch memberships={memberships} />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}
