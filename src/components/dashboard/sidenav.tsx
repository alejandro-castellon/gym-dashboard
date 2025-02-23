"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import NavLinks from "./navlinks";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";

export default function Sidenav() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  const userLabel = user?.name || user?.email || "Invitado";

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody>
        <div className="flex md:flex-col flex-1 overflow-y-auto overflow-x-hidden gap-8">
          {open ? <Logo /> : <LogoIcon />}
          <NavLinks />
        </div>
        <div>
          <SidebarLink
            link={{
              label: open ? userLabel : "", // Muestra el nombre solo si está abierto
              href: "/dashboard/profile",
              icon: (
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

const Logo = () => (
  <Link
    href="#"
    className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
  >
    <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium text-black dark:text-white whitespace-pre"
    >
      Gym App
    </motion.span>
  </Link>
);

const LogoIcon = () => (
  <Link
    href="#"
    className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
  >
    <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
  </Link>
);
