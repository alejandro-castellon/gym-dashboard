"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { HandCoins, UserCheck, UsersIcon } from "lucide-react";

export function GymDashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 pb-4">
        <h1 className="text-2xl font-medium mb-4">Dashboard</h1>
      </div>
      <div className="flex items-center space-x-2 pb-4">
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Membresías Activas Skeleton */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Membresías Activas
            </CardTitle>
            <UserCheck className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>

        {/* Total Membresías Skeleton */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Membresías
            </CardTitle>
            <UsersIcon className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>

        {/* Total Ingresos Skeleton */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Ingresos
            </CardTitle>
            <HandCoins className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24 mb-1" />
            <Skeleton className="h-3 w-40" />
          </CardContent>
        </Card>

        {/* Duplicated Total Ingresos Skeleton */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Ingresos
            </CardTitle>
            <HandCoins className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24 mb-1" />
            <Skeleton className="h-3 w-40" />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Gráfico de Ingresos Skeleton */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Ingresos</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>

        {/* Clientes Recientes Skeleton */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Clientes recientes</CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-56" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="ml-auto">
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function MembersDashboardSkeleton() {
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
}

export function DataTableSkeleton() {
  return (
    <div className="mt-4">
      <div className="flex items-center py-4">
        <Skeleton className="h-10 w-48 mr-2" />
        <Skeleton className="h-10 w-48 mr-2" />
        <Skeleton className="h-10 w-48 mr-2" />
        <Skeleton className="h-10 w-32 ml-auto" />
      </div>
      <div className="rounded-md border overflow-hidden">
        <div className="grid grid-cols-5 border-b">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
        <div>
          {Array.from({ length: 8 }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 border-b">
              {Array.from({ length: 5 }).map((_, cellIndex) => (
                <Skeleton key={cellIndex} className="h-10 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function AddClientSkeleton() {
  return (
    <div>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full mt-2" />
          </div>
          <div className="flex md:space-x-10">
            <div className="mr-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full mt-2" />
            </div>
            <div>
              <Skeleton className="h-5 w-32 ml-1" />
              <Skeleton className="h-10 w-full mt-2" />
            </div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </div>
  );
}

export function SettingsDataSkeleton() {
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
