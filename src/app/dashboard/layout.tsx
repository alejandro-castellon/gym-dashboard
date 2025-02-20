import SideNav from "@/components/dashboard/sidenav";
import { ModeToggle } from "@/components/ui/theme";
import { UserProvider } from "@/context/UserContext";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div
        className={
          "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1  mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen"
        }
      >
        <SideNav />
        <div className="relative flex-grow p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          <div className="absolute md:top-6 md:right-6 top-4 right-4">
            <ModeToggle />
          </div>
          {children}
        </div>
      </div>
    </UserProvider>
  );
}
