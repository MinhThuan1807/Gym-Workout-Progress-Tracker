import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Target, CheckCircle2 } from "lucide-react";
import { GoalCard, goalTypeConfigs } from './GoalCard';


interface GoalsSectionProps {
  activeGoals: Goal[];
  achievedGoals: Goal[];
  onAddGoal: () => void;
}

export function GoalsSection({ activeGoals, achievedGoals, onAddGoal }: GoalsSectionProps) {
  return (
    <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#111827] pt-3">Active Goals</CardTitle>
            <p className="text-sm text-[#6b7280]">Track your fitness objectives</p>
          </div>
          <Button 
            className="rounded-xl bg-[#10b981] hover:bg-[#059669]"
            onClick={onAddGoal}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activeGoals.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {activeGoals.map((goal) => (
              <GoalCard key={goal._id} goal={goal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Target className="w-16 h-16 mx-auto text-[#6b7280] mb-4" />
            <p className="text-[#6b7280]">No active goals yet</p>
            <Button 
              className="mt-4 rounded-xl bg-[#10b981] hover:bg-[#059669]"
              onClick={onAddGoal}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        )}

        {/* Achieved Goals Section */}
        {achievedGoals.length > 0 && (
          <>
            <Separator className="my-6" />
            <div>
              <h4 className="text-sm text-[#6b7280] mb-3">Achieved Goals ({achievedGoals.length})</h4>
              <div className="space-y-2 pb-3">
                {achievedGoals.map((goal) => {
                  const config = goalTypeConfigs[goal.type as GoalType];
                  const Icon = config.icon;
                  
                  return (
                    <div key={goal._id} className="flex items-center gap-3 p-3 rounded-xl bg-[#fbbf24]/10 border border-[#fbbf24]/20">
                      <div className="w-8 h-8 rounded-lg bg-[#fbbf24]/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#fbbf24]" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm text-[#111827]">{goal.name}</h5>
                        <p className="text-xs text-[#6b7280]">
                          Achieved {goal.targetValue} {goal.unit}
                        </p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-[#fbbf24]" />
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}