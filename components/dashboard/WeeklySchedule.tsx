import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Minus, Plus } from "lucide-react";
import { WeekDayInfo } from "./types";

interface WeeklyScheduleProps {
  weekDays: WeekDayInfo[];
}

export function WeeklySchedule({ weekDays }: WeeklyScheduleProps) {
  return (
    <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#111827]">This Week's Schedule</CardTitle>
            <p className="text-sm text-[#6b7280]">Planned and completed workouts</p>
          </div>
          <Button size="sm" className="rounded-xl bg-[#10b981] hover:bg-[#059669]">
            <Plus className="w-4 h-4 mr-2" />
            Log Workout
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {weekDays.map((dayInfo, index) => (
            <Card 
              key={index}
              className={`rounded-xl cursor-pointer transition-all hover:shadow-md ${
                dayInfo.isToday 
                  ? 'border-2 border-[#3b82f6] bg-[#3b82f6]/5' 
                  : dayInfo.hasSession
                  ? 'border-[#10b981] bg-[#10b981]/5'
                  : dayInfo.isPlanned && dayInfo.isFuture
                  ? 'border-[#3b82f6]/30 bg-[#3b82f6]/5'
                  : 'border-[#e5e7eb] bg-[#f9fafb]'
              }`}
            >
              <CardContent className="p-4 text-center space-y-2">
                <div className="text-xs text-[#6b7280]">
                  {dayInfo.day.substring(0, 3)}
                </div>
                <div className="text-xl text-[#111827]">
                  {dayInfo.date.getDate()}
                </div>
                {dayInfo.hasSession ? (
                  <div className="flex flex-col items-center gap-1">
                    <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                    <Badge className="bg-[#10b981] text-white text-xs px-2 py-0.5">
                      Done
                    </Badge>
                  </div>
                ) : dayInfo.isPlanned ? (
                  <div className="flex flex-col items-center gap-1">
                    <Calendar className="w-5 h-5 text-[#3b82f6]" />
                    <Badge variant="outline" className="text-xs px-2 py-0.5 border-[#3b82f6] text-[#3b82f6]">
                      Planned
                    </Badge>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Minus className="w-5 h-5 text-[#6b7280]" />
                    <Badge variant="outline" className="text-xs px-2 py-0.5 border-[#6b7280] text-[#6b7280]">
                      Rest
                    </Badge>
                  </div>
                )}
                {dayInfo.isToday && (
                  <div className="absolute top-1 right-1">
                    <div className="w-2 h-2 bg-[#3b82f6] rounded-full animate-pulse" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}