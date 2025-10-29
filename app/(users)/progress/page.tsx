'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Suspense, useState } from "react";
import { SkeletonProgress } from "@/components/skeleton/SkeletonProgress";

const progressData = [
  { date: "Sep 1", weight: 84, bodyFat: 18 },
  { date: "Sep 8", weight: 83.5, bodyFat: 17.8 },
  { date: "Sep 15", weight: 83, bodyFat: 17.5 },
  { date: "Sep 22", weight: 82.5, bodyFat: 17.2 },
  { date: "Sep 29", weight: 82, bodyFat: 17 },
  { date: "Oct 6", weight: 81.5, bodyFat: 16.8 },
  { date: "Oct 13", weight: 81, bodyFat: 16.5 },
  { date: "Oct 20", weight: 80.5, bodyFat: 16.3 },
  { date: "Oct 27", weight: 80, bodyFat: 16 },
];

export default function ProgressPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const workoutDates = [new Date(2025, 9, 1), new Date(2025, 9, 2), new Date(2025, 9, 3)];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Progress Tracking</h1>
        <p className="text-muted-foreground">Monitor your body composition and improvements</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card className="rounded-2xl border shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle>Log Metrics</CardTitle>
            <p className="text-sm text-muted-foreground">Record your current stats</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input type="number" placeholder="80" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Body Fat %</Label>
              <Input type="number" placeholder="16" className="rounded-xl" />
            </div>
            <Button className="w-full rounded-xl">Save Entry</Button>

            <div className="pt-4 border-t">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Weight</span>
                  <span className="font-semibold">80 kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Starting Weight</span>
                  <span className="font-semibold">84 kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-primary">-4 kg</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
       <Suspense fallback={<SkeletonProgress />}>
            <div className="lg:col-span-2 space-y-6">
              <Card className="rounded-2xl border shadow-sm">
                <CardHeader>
                  <CardTitle>Weight & Body Fat Trends</CardTitle>
                  <p className="text-sm text-muted-foreground">Track your transformation over time</p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis yAxisId="left" stroke="#6b7280" domain={[78, 86]} />
                      <YAxis yAxisId="right" orientation="right" stroke="#6b7280" domain={[15, 19]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem'
                        }} 
                      />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        name="Weight (kg)"
                        dot={{ fill: '#10b981', r: 4 }}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="bodyFat" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        name="Body Fat %"
                        dot={{ fill: '#3b82f6', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
    
              <Card className="rounded-2xl border shadow-sm">
                <CardHeader>
                  <CardTitle>Workout Calendar</CardTitle>
                  <p className="text-sm text-muted-foreground">Days with logged workouts are highlighted</p>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-xl border"
                    modifiers={{
                      workout: workoutDates
                    }}
                    modifiersClassNames={{
                      workout: "bg-primary text-primary-foreground"
                    }}
                  />
                </CardContent>
              </Card>
            </div>
       </Suspense>
      </div>
    </div>
  );
}
