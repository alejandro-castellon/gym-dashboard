import { Metadata } from "next";
import { Suspense } from "react";
import { Payment, columns } from "@/components/dashboard/gyms/clients/columns";
import { DataTable } from "@/components/dashboard/gyms/clients/data-table";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Clientes",
};

export default function Page() {
  const data: Payment[] = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "a@example.com",
    },
  ];

  return (
    <main>
      <h1>Clientes</h1>
      <Suspense
        fallback={<Skeleton className="h-[125px] w-[250px] rounded-xl" />}
      >
        <DataTable columns={columns} data={data} />
      </Suspense>
    </main>
  );
}
