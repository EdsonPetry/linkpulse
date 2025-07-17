import { RefreshCcw } from 'lucide-react';
import { Bar, BarChart } from "recharts"
import { Button } from "./ui/button";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const status = 200;

export function SmallCard({ className = "", active }: { className?: string; active: boolean }) {
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
        <p>Notes: notes go here</p>
      </CardContent>
    </Card>
  )
}

