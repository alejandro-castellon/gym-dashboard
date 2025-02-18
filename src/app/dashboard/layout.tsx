import SideNav from "@/components/dashboard/sidenav";
import { ModeToggle } from "@/components/ui/theme";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1  mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen"
      }
    >
      <SideNav />
      <div className="flex-grow p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
        <ModeToggle />
        {children}
      </div>
    </div>
  );
}
