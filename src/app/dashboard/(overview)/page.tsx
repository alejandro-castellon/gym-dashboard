import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Dashboard() {
  return (
    <div className="flex flex-1">
      <div className="flex flex-col gap-2 flex-1 w-full h-screen">
        <div className="flex items-center gap-4">Hey,!</div>
      </div>
    </div>
  );
}
