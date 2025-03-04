"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Membership } from "@/types";

const membershipTypeLabels: { [key: number]: string } = {
  1: "Mensual",
  2: "Trimestral",
  3: "Semestral",
  4: "Anual",
  5: "Día por medio",
};

export const columns: ColumnDef<Membership>[] = [
  {
    accessorKey: "user_email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => row.users?.name,
  },
  {
    accessorKey: "ci",
    header: "Ci",
    accessorFn: (row) => row.users?.ci,
    filterFn: (row, id, value) => {
      const ci = row.getValue(id) as number;
      const searchValue = value as string;
      return ci?.toString().includes(searchValue);
    },
  },
  {
    accessorKey: "membership_type_id",
    header: "Tipo de membresía",
    cell: ({ row }) => {
      const membershipType = row.getValue("membership_type_id");
      return (
        <div>
          {membershipTypeLabels[membershipType as number] || "Desconocido"}
        </div>
      );
    },
  },
  {
    accessorKey: "start_date",
    header: "Fecha de inscripción",
    cell: ({ row }) => {
      const startDate = row.getValue("start_date") as string;
      const date = new Date(startDate);

      // Ajuste manual del día para que coincida con la zona horaria local (solo si es necesario)
      const day = date.getUTCDate();
      const month = date.getUTCMonth() + 1; // Los meses en JavaScript son 0-indexados
      const year = date.getUTCFullYear();

      // Retornar en formato dd/mm/yyyy
      return `${day < 10 ? `0${day}` : day}/${
        month < 10 ? `0${month}` : month
      }/${year}`;
    },
  },
  {
    accessorKey: "end_date",
    header: "Fecha de finalización",
    cell: ({ row }) => {
      const endDate = row.getValue("end_date") as string;
      const date = new Date(endDate);

      // Ajuste manual del día para que coincida con la zona horaria local (solo si es necesario)
      const day = date.getUTCDate();
      const month = date.getUTCMonth() + 1; // Los meses en JavaScript son 0-indexados
      const year = date.getUTCFullYear();

      // Retornar en formato dd/mm/yyyy
      return `${day < 10 ? `0${day}` : day}/${
        month < 10 ? `0${month}` : month
      }/${year}`;
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Precio</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

      return <div className="text-right font-medium">Bs {formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.user_email)}
            >
              Copiar email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver cliente</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
