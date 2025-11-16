import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ActivityItem } from "./types";

interface RecentActivityProps {
  activities: ActivityItem[];
  timeAgo: (dateStr: string) => string;
}

export function RecentActivity({ activities, timeAgo }: RecentActivityProps) {
  return (
    <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#111827]">Recent Activity</CardTitle>
            <p className="text-sm text-[#6b7280]">Your latest fitness activities</p>
          </div>
          <Button variant="ghost" size="sm" className="rounded-xl text-[#3b82f6]">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-4">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${activity.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: activity.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-[#111827]">{activity.description}</p>
                      {activity.details && (
                        <p className="text-xs text-[#6b7280] mt-1">{activity.details}</p>
                      )}
                    </div>
                    <span className="text-xs text-[#6b7280] whitespace-nowrap">
                      {timeAgo(activity.date)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}