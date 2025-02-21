import React from "react";
import { Metadata } from "next";
import AddClientForm from "@/components/dashboard/gyms/clients/add-client";

export const metadata: Metadata = {
  title: "Agregar cliente",
};

export default function page() {
  return (
    <div>
      <h1>Agregar cliente</h1>
      <AddClientForm />
    </div>
  );
}
