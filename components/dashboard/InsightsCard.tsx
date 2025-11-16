import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Lightbulb } from "lucide-react";

interface InsightsCardProps {
  insights: string[];
}

export function InsightsCard({ insights }: InsightsCardProps) {
  return (
    <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-gradient-to-br from-[#fbbf24]/10 to-[#f59e0b]/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#fbbf24]/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-[#fbbf24]" />
          </div>
          <CardTitle className="text-[#111827]">Insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="p-3 bg-white/80 rounded-xl">
            <p className="text-sm text-[#111827]">{insight}</p>
          </div>
        ))}
        <Separator />
        <Button variant="ghost" size="sm" className="w-full rounded-xl text-[#3b82f6]">
          View Detailed Analytics
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}