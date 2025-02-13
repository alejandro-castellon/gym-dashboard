import SideNav from "@/components/dashboard/sidenav";
import { cn } from "@/lib/utils";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1  mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen"
      )}
    >
      <SideNav />
      <div className="flex-grow">{children}</div>
    </div>
  );
}
