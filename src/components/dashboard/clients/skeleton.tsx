import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Asegúrate de tener un componente Skeleton

const MembershipDashboardSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Skeleton de la Información de la Membresía */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-1/2" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-3/4 mt-2" />
          <Skeleton className="h-4 w-3/4 mt-2" />
          <Skeleton className="h-4 w-1/4 mt-2" />
        </CardContent>
      </Card>

      {/* Skeleton de los Horarios del Gimnasio */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-1/2" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {Array(7)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
          </div>
          <Skeleton className="h-4 w-1/2 mt-4" />
        </CardContent>
      </Card>

      {/* Skeleton del Botón de Soporte */}
      <div className="text-center">
        <Skeleton className="h-10 w-32 mx-auto" />
      </div>
    </div>
  );
};

export default MembershipDashboardSkeleton;
