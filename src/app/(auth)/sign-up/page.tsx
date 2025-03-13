import { signUpAction } from "@/lib/supabase/actions";
import { FormMessage, Message } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Google from "@/components/auth/google";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto rounded-3xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h1 className="text-2xl font-medium mb-2">Crea tu cuenta</h1>

      <div className="flex justify-center my-8">
        <Google />
      </div>

      <div className="flex items-center justify-center my-4">
        <div className="w-full h-px bg-neutral-300 dark:bg-neutral-700" />
        <span className="mx-4 text-sm text-neutral-500 dark:text-neutral-400">
          o
        </span>
        <div className="w-full h-px bg-neutral-300 dark:bg-neutral-700" />
      </div>

      <form className="space-y-6">
        <LabelInputContainer>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            name="email"
            placeholder="clubsmanager@ejemplo.com"
            type="email"
            required
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
            minLength={6}
            required
          />
        </LabelInputContainer>

        <SubmitButton
          className="relative group/bt text-white rounded-md h-10 w-full font-medium"
          formAction={signUpAction}
          pendingText="Registrando..."
        >
          Registrarse
        </SubmitButton>
      </form>
      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />
      <FormMessage message={searchParams} />

      <p className="text-sm text-foreground mt-4 text-center">
        ¿Ya tienes una cuenta?{" "}
        <Link className="text-primary font-medium underline" href="/sign-in">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
