import React from "react";
import { RefreshCcw } from 'lucide-react';
import { Bar, BarChart } from "recharts"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const status = 200;

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig

export function LinkCard({ className = "", active }: { className?: string; active: boolean }) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!active) {
    return (
      <div className={`flex items-center justify-center border-2 border-dashed border-muted text-muted-foreground rounded-lg ${className}`}>
        <span className="text-2xl font-bold">+</span>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Name of Service</CardTitle>
        <CardDescription>Status: {status}</CardDescription>
        <CardAction>
          <Button>
            <RefreshCcw />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
                <p>URL: https://hello.world/api</p>
                <p>Frequency: 1 per Second</p>
            </TabsContent>
            <TabsContent value="chart">
              {mounted && (
                <ChartContainer config={chartConfig} className="min-h-[100px] w-full">
                  <BarChart accessibilityLayer data={chartData}>
                    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                  </BarChart>
                </ChartContainer>
              )}
            </TabsContent>
        </Tabs>        
      </CardContent>
    </Card>
  )
}
