export interface MetricEntry {
  id: string;
  date: string;
  metricType: string;
  value: number;
}

export interface WorkoutSession {
  id: string;
  startTime: string;
  endTime?: string;
  planName?: string;
  exerciseCount: number;
  duration?: number;
}

// export interface Goal {
//   _id: string;
//   name: string;
//   status: 'active' | 'achieved' | 'abandoned';
//   currentValue: number;
//   targetValue: number;
//   unit: string;
//   achievedDate?: string;
// }

export interface WorkoutPlanDay {
  day: string;
  exercises: string[];
}

export type ActivityItem = {
  id: string;
  type: 'workout' | 'metric' | 'goal';
  date: string;
  description: string;
  icon: any;
  color: string;
  details?: string;
};

export interface WeekDayInfo {
  day: string;
  date: Date;
  isPlanned: boolean;
  hasSession: boolean;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  exercises: string[];
}