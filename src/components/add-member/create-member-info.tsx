import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

export default function CreateMemberInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="text-xs text-muted-foreground underline cursor-pointer hover:text-primary transition ml-auto">
          El usuario no tiene cuenta?
        </p>
      </DialogTrigger>
      <DialogContent className="p-4 bg-white shadow-lg rounded-md border border-gray-200 sm:w-full md:w-80">
        <DialogTitle className="text-lg font-semibold text-gray-800">
          Instrucciones
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-700">
          <div className="space-y-3">
            <p>
              <span className="font-semibold">1. </span>Introduce el correo
              electrónico del cliente.
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold">2. </span>Presiona el botón{" "}
              <span className="underline text-primary">Crear cuenta</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold">3. </span>La contraseña será el
              nombre del correo electrónico.
            </p>
            <p className="font-semibold">Ejemplo:</p>
            <p>Email: clubsmanager@example.com</p>
            <p>Contraseña: clubsmanager</p>
            <p>
              <span className="font-semibold">4. </span>Continua creando la
              membresía.
            </p>
          </div>
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <button className="text-primary font-medium text-sm">Cerrar</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
