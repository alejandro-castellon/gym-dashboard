import { signOutAction } from "@/lib/actions";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }
  return (
    <div className="flex flex-1">
      <div className="flex flex-col gap-2 flex-1 w-full h-screen">
        <div className="flex gap-2">
          {[...new Array(4)].map((_, index) => (
            <div
              key={`first-array-${index}`} // ✅ Usa el índice para que sea único
              className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
        <div className="flex gap-2 flex-1">
          {[...new Array(2)].map((_, index) => (
            <div
              key={`second-array-${index}`} // ✅ Clave única
              className="h-80 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          Hey, {user.email}!
          <form action={signOutAction}>
            <Button type="submit" variant={"outline"}>
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
