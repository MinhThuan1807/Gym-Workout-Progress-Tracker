import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Lock } from "lucide-react";

interface AchievementsCardProps {
  achievements: Achievement[];
  unlockedCount: number;
}

export function AchievementsCard({ achievements, unlockedCount }: AchievementsCardProps) {
  return (
    <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-[#111827] pt-3">Achievements</CardTitle>
        <p className="text-sm text-[#6b7280]">
          {unlockedCount}/{achievements.length} unlocked
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {achievements.map((achievement) => (
            <div
              key={achievement._id}
              className={`relative group cursor-pointer transition-all duration-300 ${
                achievement.unlocked 
                  ? 'hover:scale-105' 
                  : 'grayscale opacity-50'
              }`}
            >
              {/* Badge */}
              <div 
                className={`relative w-full aspect-square rounded-2xl flex flex-col items-center justify-center p-3 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br shadow-lg' 
                    : 'bg-[#e5e7eb]'
                }`}
                style={
                  achievement.unlocked 
                    ? { 
                        backgroundImage: `linear-gradient(135deg, ${achievement.color}20, ${achievement.color}40)`,
                        boxShadow: achievement.unlocked ? `0 4px 20px ${achievement.color}40` : 'none'
                      }
                    : {}
                }
              >
                <div className="text-3xl mb-1">{achievement.icon}</div>
                <p className="text-xs text-center text-[#111827] leading-tight">
                  {achievement.name}
                </p>
                
                {/* Lock Icon */}
                {!achievement.unlocked && (
                  <div className="absolute top-2 right-2">
                    <Lock className="w-4 h-4 text-[#6b7280]" />
                  </div>
                )}

                {/* Glow Effect */}
                {achievement.unlocked && (
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ 
                      boxShadow: `0 0 30px ${achievement.color}80`,
                      animation: 'pulse 2s infinite'
                    }}
                  />
                )}
              </div>

              {/* Progress Bar */}
              {!achievement.unlocked && achievement.progress !== undefined && achievement.requirement && (
                <div className="mt-2">
                  <Progress 
                    value={(achievement.progress / achievement.requirement) * 100} 
                    className="h-1"
                  />
                  <p className="text-xs text-[#6b7280] text-center mt-1">
                    {achievement.progress}/{achievement.requirement}
                  </p>
                </div>
              )}

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {achievement.description}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}