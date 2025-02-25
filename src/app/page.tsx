import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const words = `Bienvenidos a EGE`;

export default function Home() {
  return (
    <div className="flex gap-2 justify-center">
      <TextGenerateEffect words={words} />
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}


