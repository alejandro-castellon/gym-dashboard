import { Metadata } from "next";
import MemberDashboard from "@/components/dashboard/members";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export const metadata: Metadata = {
  title: "Miembro",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <h1 className="text-2xl font-medium mb-4">Miembro</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <MemberDashboard id={id} />
      </Suspense>
    </>
  );
}
