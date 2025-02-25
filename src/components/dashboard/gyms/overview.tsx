"use client";

import * as React from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Membership } from "@/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface OverviewProps {
  data: Membership[];
}

export function Overview({ data }: OverviewProps) {
  // Lista de todos los meses del año
  const allMonths = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  // Agrupar los ingresos por mes
  const groupedData = data.reduce((acc, membership) => {
    const monthIndex = new Date(membership.start_date).getMonth();
    acc[monthIndex] += membership.price;
    return acc;
  }, Array(12).fill(0));

  // Formatear los datos para la gráfica
  const monthlyData = allMonths.map((month, index) => ({
    name: month,
    total: groupedData[index],
  }));

  // Configuración de colores para la gráfica
  const chartConfig = {
    total: {
      label: "Ingresos Mensuales",
      theme: {
        light: "hsl(var(--primary))",
        dark: "hsl(var(--primary))",
      },
    },
  };

  // Función para formatear valores monetarios
  const formatCurrency = (value: number) => `Bs ${value.toLocaleString()}`;

  return (
    <ChartContainer
      config={chartConfig}
      className="w-full md:h-[50vh] lg:h-[60vh]"
    >
      <BarChart
        data={monthlyData}
        margin={{ top: 10, right: 10, left: 5, bottom: 24 }}
      >
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatCurrency}
          width={80}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => formatCurrency(value as number)}
            />
          }
        />
        <Bar dataKey="total" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ChartContainer>
  );
}
