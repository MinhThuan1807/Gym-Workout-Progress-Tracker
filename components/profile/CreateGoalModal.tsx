import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Target } from "lucide-react";
import { useState } from "react";
import { goalTypeConfigs } from "./GoalCard";


interface CreateGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGoalModal({ open, onOpenChange }: CreateGoalModalProps) {
  const [selectedGoalType, setSelectedGoalType] = useState<GoalType>('weight');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#111827]">Create New Goal</DialogTitle>
          <DialogDescription className="text-[#6b7280]">
            Set a new fitness objective to track your progress
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Goal Type Selector */}
          <div className="space-y-2">
            <Label className="text-[#111827]">Goal Type</Label>
            <Select value={selectedGoalType} onValueChange={(value) => setSelectedGoalType(value as GoalType)}>
              <SelectTrigger className="rounded-xl border-[#e5e7eb]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(goalTypeConfigs).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color: config.color }} />
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Goal Name */}
          <div className="space-y-2">
            <Label className="text-[#111827]">Goal Name</Label>
            <Input 
              placeholder="e.g., Reach 75kg"
              className="rounded-xl border-[#e5e7eb]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Value */}
            <div className="space-y-2">
              <Label className="text-[#111827]">
                Start Value (Optional)
                <span className="text-[#6b7280] ml-2">({goalTypeConfigs[selectedGoalType].unit})</span>
              </Label>
              <Input 
                type="number"
                step="0.1"
                placeholder="Auto-filled"
                className="rounded-xl border-[#e5e7eb]"
              />
            </div>

            {/* Target Value */}
            <div className="space-y-2">
              <Label className="text-[#111827]">
                Target Value
                <span className="text-[#6b7280] ml-2">({goalTypeConfigs[selectedGoalType].unit})</span>
              </Label>
              <Input 
                type="number"
                step="0.1"
                placeholder="Enter target"
                className="rounded-xl border-[#e5e7eb]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label className="text-[#111827]">Start Date</Label>
              <Input 
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="rounded-xl border-[#e5e7eb]"
              />
            </div>

            {/* Target Date */}
            <div className="space-y-2">
              <Label className="text-[#111827]">Target Date (Optional)</Label>
              <Input 
                type="date"
                className="rounded-xl border-[#e5e7eb]"
              />
            </div>
          </div>

          {/* Link to Exercise */}
          {(selectedGoalType === 'oneRepMax' || selectedGoalType === 'strength') && (
            <div className="space-y-2">
              <Label className="text-[#111827]">Link to Exercise</Label>
              <Select>
                <SelectTrigger className="rounded-xl border-[#e5e7eb]">
                  <SelectValue placeholder="Select exercise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Barbell Squat</SelectItem>
                  <SelectItem value="2">Bench Press</SelectItem>
                  <SelectItem value="3">Deadlift</SelectItem>
                  <SelectItem value="4">Pull-Up</SelectItem>
                  <SelectItem value="8">Dumbbell Shoulder Press</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-[#111827]">Notes (Optional)</Label>
            <Textarea 
              placeholder="Add any additional details about this goal..."
              className="rounded-xl border-[#e5e7eb] min-h-[100px]"
            />
          </div>

          {/* Save Button */}
          <div className="flex gap-3 pt-4 border-t border-[#e5e7eb]">
            <Button 
              className="flex-1 bg-[#10b981] hover:bg-[#059669] rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              <Target className="w-4 h-4 mr-2" />
              Create Goal
            </Button>
            <Button 
              variant="ghost" 
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}