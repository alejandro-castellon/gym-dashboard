import { Metadata } from "next";

import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Clientes",
};

export default function Page() {
  return <Suspense>Hey customers</Suspense>;
}
