import { Metadata } from "next";

import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Customers",
};

export default function Page() {
  return <Suspense>Hey customers</Suspense>;
}
