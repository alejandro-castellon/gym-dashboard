export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm">
      {"success" in message && (
        <div className="border-l-2 border-primary px-4 text-primary">
          {message.success}
        </div>
      )}
      {"error" in message && (
        <div className="dark:text-destructive-foreground text-destructive border-l-2 border-destructive dark:border-destructive-foreground px-4">
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="text-foreground border-l-2 px-4">{message.message}</div>
      )}
    </div>
  );
}
