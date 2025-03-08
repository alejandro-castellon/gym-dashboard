"use client";

import {
  FileUser,
  LayoutDashboard,
  MonitorCheck,
  Settings,
  Users,
  UserPlus,
  LogOut,
} from "lucide-react";
import { SidebarLink } from "@/components/ui/sidebar";
import { signOutAction } from "@/lib/supabase/actions";
import { useUser } from "@/context/UserContext";
import LoadingSpinner from "../ui/loading-spinner";
import React, { useMemo } from "react";

const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
    ),
  },
  {
    label: "Miembros",
    href: "/dashboard/members",
    icon: (
      <Users className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
    ),
  },
  {
    label: "Agregar miembro",
    href: "/dashboard/add-member",
    icon: (
      <UserPlus className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
    ),
  },
  {
    label: "Mi Membresía",
    href: "/dashboard/membership",
    icon: (
      <FileUser className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
    ),
  },
  {
    label: "Check-In",
    href: "/dashboard/checkin",
    icon: (
      <MonitorCheck className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
    ),
  },
  {
    label: "Configuración",
    href: "/dashboard/settings",
    icon: (
      <Settings className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
    ),
  },
  {
    label: "Cerrar sesión",
    href: "#",
    icon: (
      <LogOut className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
    ),
    onClick: signOutAction,
  },
];

export default function NavLinks() {
  const { isAdmin, loading } = useUser();

  const filteredLinks = useMemo(() => {
    return isAdmin
      ? links.filter((link) => link.label !== "Mi Membresía")
      : links.filter(
          (link) =>
            link.label === "Dashboard" ||
            link.label === "Mi Membresía" ||
            link.label === "Cerrar sesión"
        );
  }, [isAdmin]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="md:mt-8 flex md:flex-col gap-6 md:gap-2 flex-row">
      {filteredLinks.map((link, idx) => (
        <SidebarLink key={idx} link={{ ...link }} />
      ))}
    </div>
  );
}
