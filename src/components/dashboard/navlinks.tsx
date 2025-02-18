"use client";

import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { SidebarLink } from "@/components/ui/sidebar";
import { signOutAction } from "@/lib/supabase/actions";

const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
    ),
  },
  {
    label: "Clientes",
    href: "/dashboard/customers",
    icon: (
      <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
    ),
  },
  {
    label: "Settings",
    href: "#",
    icon: (
      <IconSettings className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
    ),
  },
  {
    label: "Logout",
    href: "#",
    icon: (
      <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
    ),
    onClick: signOutAction,
  },
];

export default function NavLinks() {
  return (
    <div className="md:mt-8 flex md:flex-col gap-10 md:gap-2 flex-row">
      {links.map((link, idx) => (
        <SidebarLink key={idx} link={{ ...link, onClick: link.onClick }} />
      ))}
    </div>
  );
}
