import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, TrendingDown, TrendingUp } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface WeightCardProps {
  latestWeight: number;
  weightTrend: number;
  sparklineData: Array<{ date: string; value: number }>;
}

export function WeightCard({ latestWeight, weightTrend, sparklineData }: WeightCardProps) {
  return (
    <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-[#6b7280]">Current Weight</CardTitle>
        <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
          <Scale className="w-5 h-5 text-[#10b981]" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl text-[#111827]">{latestWeight.toFixed(1)} kg</div>
        <div className="flex items-center gap-2">
          {weightTrend < 0 ? (
            <TrendingDown className="w-4 h-4 text-[#10b981]" />
          ) : (
            <TrendingUp className="w-4 h-4 text-[#ef4444]" />
          )}
          <span className={`text-sm ${weightTrend < 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
            {weightTrend < 0 ? '' : '+'}{weightTrend.toFixed(1)} kg from last month
          </span>
        </div>
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                fill="url(#weightGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}