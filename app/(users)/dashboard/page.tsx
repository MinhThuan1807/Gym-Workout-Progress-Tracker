'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Zap, Dumbbell, Calendar } from "lucide-react";
import { Suspense } from "react";
import { SkeletonDashboard } from "@/components/skeleton/SkeletonDashboard";
const weightData = [
  { date: "Oct 1", weight: 82 },
  { date: "Oct 8", weight: 81.5 },
  { date: "Oct 15", weight: 83 },
  { date: "Oct 22", weight: 80.5 },
  { date: "Oct 29", weight: 80 },
];

const strengthData = [
  { exercise: "Squat", weight: 100 },
  { exercise: "Bench", weight: 80 },
  { exercise: "Deadlift", weight: 120 },
  { exercise: "OHP", weight: 50 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your fitness overview.</p>
      </div>
    <Suspense fallback={<SkeletonDashboard />}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Current Weight</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80 kg</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary">-2 kg</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Workouts This Week</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary">+2</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Sets/Reps</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45 / 540</div>
            <p className="text-xs text-muted-foreground">
              This week's volume
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader>
            <CardTitle>Weight Progress</CardTitle>
            <p className="text-sm text-muted-foreground">Your weight over time</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[79, 83]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader>
            <CardTitle>Strength Progression</CardTitle>
            <p className="text-sm text-muted-foreground">Current max lifts (kg)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={strengthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="exercise" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }} 
                />
                <Bar dataKey="weight" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Workouts */}
      <Card className="rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle>Recent Workouts</CardTitle>
          <p className="text-sm text-muted-foreground">Your last training sessions</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: "Oct 3", name: "Upper Body", exercises: 6 },
              { date: "Oct 2", name: "Lower Body", exercises: 5 },
              { date: "Oct 1", name: "Push Day", exercises: 7 },
            ].map((workout, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{workout.name}</div>
                    <div className="text-sm text-muted-foreground">{workout.date}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {workout.exercises} exercises
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Suspense>
    </div>
  );
}
export default Dashboard;