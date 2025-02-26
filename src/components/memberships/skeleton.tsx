"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

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
