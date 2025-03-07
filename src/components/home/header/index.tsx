import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full bg-gray-500 h-20">
        <div className="absolute top-4 right-4 flex gap-4">
          <Button asChild size="lg" variant="outline">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="lg" variant="default">
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
