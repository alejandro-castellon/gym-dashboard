import { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import MembershipTable from "@/components/clients/get-data";

export const metadata: Metadata = {
  title: "Clientes",
};

export default async function Page() {
  return (
    <main>
      <h1 className="text-2xl font-medium">Clientes</h1>
      <Suspense fallback={<Skeleton className="mt-8 h-96 w-full rounded-xl" />}>
        <MembershipTable />
      </Suspense>
    </main>
  );
}
