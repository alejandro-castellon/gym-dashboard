import { updateEmailAction } from "@/lib/supabase/actions";
import { FormMessage, Message } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function UpdateEmail(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
      <h1 className="text-2xl font-medium">Update Email</h1>
      <p className="text-sm text-foreground/60">
        Please enter your new email below.
      </p>
      <Label htmlFor="email">New email</Label>
      <Input type="email" name="email" placeholder="New email" required />
      <Label htmlFor="confirmEmail">Confirm email</Label>
      <Input
        type="email"
        name="confirmEmail"
        placeholder="Confirm email"
        required
      />
      <SubmitButton formAction={updateEmailAction}>Update Email</SubmitButton>
      <FormMessage message={searchParams} />
    </form>
  );
}
