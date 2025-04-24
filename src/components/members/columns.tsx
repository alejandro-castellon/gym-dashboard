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
import Link from "next/link";

const membershipTypeLabels: { [key: number]: string } = {
  1: "Mensual",
  2: "Trimestral",
  3: "Semestral",
  4: "Anual",
  5: "Día por medio",
};

export const columns: ColumnDef<Membership>[] = [
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
    cell: ({ row }) => {
      const id = row.original.users?.id;
      const name = row.getValue("name");
      return id ? (
        <Link
          href={`/dashboard/members/${id}`}
          className="font-bold text-sky-600 hover:text-blue-800"
        >
          {name as string}
        </Link>
      ) : (
        <span>{name as string}</span>
      );
    },
    accessorFn: (row) => row.users?.name,
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
    accessorKey: "days_left",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Días restantes
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const daysLeft = row.getValue("days_left") as number;
      const textColor = daysLeft < 7 ? "text-red-500" : "text-green-500";
      return <div className={`${textColor}`}>{daysLeft}</div>;
    },
  },
  {
    accessorKey: "metodo_pago",
    header: "Método pago",
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
