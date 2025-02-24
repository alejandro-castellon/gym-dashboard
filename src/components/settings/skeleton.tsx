"use client";

import { CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
export default function SettingsDataSkeleton() {
  return (
    <div>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Skeleton className="h-10 w-full" />
            <Label htmlFor="price" className="pt-4">
              Precio de la membresia
            </Label>
            <Skeleton className="h-10 w-full" />
            <div className="flex justify-center font-semibold mt-4">
              <span className="mt-4 md:mb-2">Horarios</span>
            </div>
            {[...Array(7)].map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-10 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" disabled>
          <Skeleton className="h-6 w-16" />
        </Button>
        <Button disabled>
          <Skeleton className="h-6 w-16" />
        </Button>
      </CardFooter>
    </div>
  );
}
