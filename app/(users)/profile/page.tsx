'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Target, TrendingUp, Edit } from "lucide-react";

const achievements = [
  { icon: "🏆", name: "100 Workouts", description: "Completed 100 training sessions", earned: true },
  { icon: "💪", name: "Strength Master", description: "Lifted 10,000kg total volume", earned: true },
  { icon: "🔥", name: "30 Day Streak", description: "Worked out for 30 days straight", earned: true },
  { icon: "⭐", name: "Goal Crusher", description: "Achieved your first fitness goal", earned: true },
  { icon: "🎯", name: "Consistency King", description: "6 months of regular training", earned: false },
  { icon: "💎", name: "Elite Lifter", description: "Bench 1.5x bodyweight", earned: false },
];

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account and track achievements</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                <Button variant="ghost" size="sm" className="rounded-xl">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="https://images.unsplash.com/photo-1711006366881-5076ba350008?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB3b3Jrb3V0JTIwcGVyc29ufGVufDF8fHx8MTc1OTQ5Mjk1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-semibold">John Doe</h3>
                  <p className="text-muted-foreground">john.doe@email.com</p>
                  <Badge className="mt-2 bg-primary/10 text-primary rounded-lg">Pro Member</Badge>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue="John Doe" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="john.doe@email.com" type="email" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input defaultValue="28" type="number" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input defaultValue="178" type="number" className="rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle>Fitness Goals</CardTitle>
              <p className="text-sm text-muted-foreground">Set your training objectives</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Primary Goal</Label>
                <Select defaultValue="muscle">
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="muscle">Build Muscle</SelectItem>
                    <SelectItem value="fat">Lose Fat</SelectItem>
                    <SelectItem value="strength">Gain Strength</SelectItem>
                    <SelectItem value="endurance">Improve Endurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target Weight (kg)</Label>
                <Input defaultValue="85" type="number" className="rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label>Weekly Workout Goal</Label>
                <Input defaultValue="5" type="number" className="rounded-xl" />
              </div>

              <Button className="w-full rounded-xl">Update Goals</Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats & Achievements */}
        <div className="space-y-6">
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Total Workouts</div>
                  <div className="font-semibold">124</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Current Streak</div>
                  <div className="font-semibold">12 days</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Goals Achieved</div>
                  <div className="font-semibold">8 / 10</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Total Volume</div>
                  <div className="font-semibold">12,450 kg</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <p className="text-sm text-muted-foreground">Badges & Milestones</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-xl border ${
                    achievement.earned 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'bg-muted/30 border-muted opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{achievement.name}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                    </div>
                    {achievement.earned && (
                      <div className="text-xs text-primary font-semibold">✓</div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
