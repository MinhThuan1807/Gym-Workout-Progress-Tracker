// import { MetricEntry, WorkoutSession, Goal, WorkoutPlanDay } from "./types";

// export const weightMetrics: MetricEntry[] = [
//   { id: '1', date: '2025-10-07', metricType: 'weight', value: 82.0 },
//   { id: '2', date: '2025-10-10', metricType: 'weight', value: 81.7 },
//   { id: '3', date: '2025-10-14', metricType: 'weight', value: 81.4 },
//   { id: '4', date: '2025-10-17', metricType: 'weight', value: 81.2 },
//   { id: '5', date: '2025-10-21', metricType: 'weight', value: 81.0 },
//   { id: '6', date: '2025-10-24', metricType: 'weight', value: 80.7 },
//   { id: '7', date: '2025-10-28', metricType: 'weight', value: 80.4 },
//   { id: '8', date: '2025-10-31', metricType: 'weight', value: 80.2 },
//   { id: '9', date: '2025-11-03', metricType: 'weight', value: 80.0 },
//   { id: '10', date: '2025-11-04', metricType: 'weight', value: 79.8 },
// ];

// export const workoutSessions: WorkoutSession[] = [
//   { id: 's1', startTime: '2025-10-07T10:00:00', endTime: '2025-10-07T11:15:00', planName: 'Push Day', exerciseCount: 5, duration: 75 },
//   { id: 's2', startTime: '2025-10-09T14:00:00', endTime: '2025-10-09T15:20:00', exerciseCount: 6, duration: 80 },
//   { id: 's3', startTime: '2025-10-11T10:30:00', endTime: '2025-10-11T11:45:00', planName: 'Leg Day', exerciseCount: 4, duration: 75 },
//   { id: 's4', startTime: '2025-10-14T09:00:00', endTime: '2025-10-14T10:30:00', planName: 'Pull Day', exerciseCount: 6, duration: 90 },
//   { id: 's5', startTime: '2025-10-16T15:00:00', endTime: '2025-10-16T16:15:00', exerciseCount: 5, duration: 75 },
//   { id: 's6', startTime: '2025-10-18T10:00:00', endTime: '2025-10-18T11:20:00', planName: 'Push Day', exerciseCount: 5, duration: 80 },
//   { id: 's7', startTime: '2025-10-21T14:00:00', endTime: '2025-10-21T15:10:00', exerciseCount: 4, duration: 70 },
//   { id: 's8', startTime: '2025-10-23T10:30:00', endTime: '2025-10-23T11:45:00', planName: 'Leg Day', exerciseCount: 5, duration: 75 },
//   { id: 's9', startTime: '2025-10-25T09:00:00', endTime: '2025-10-25T10:30:00', planName: 'Pull Day', exerciseCount: 6, duration: 90 },
//   { id: 's10', startTime: '2025-10-28T15:00:00', endTime: '2025-10-28T16:20:00', exerciseCount: 5, duration: 80 },
//   { id: 's11', startTime: '2025-10-30T10:00:00', endTime: '2025-10-30T11:15:00', planName: 'Push Day', exerciseCount: 5, duration: 75 },
//   { id: 's12', startTime: '2025-11-01T14:00:00', endTime: '2025-11-01T15:10:00', exerciseCount: 4, duration: 70 },
//   { id: 's13', startTime: '2025-11-03T10:30:00', endTime: '2025-11-03T11:50:00', planName: 'Leg Day', exerciseCount: 6, duration: 80 },
//   { id: 's14', startTime: '2025-11-04T09:00:00', endTime: '2025-11-04T10:20:00', planName: 'Pull Day', exerciseCount: 5, duration: 80 },
// ];

// export const goals: Goal[] = [
//   { _id: 'g1', name: 'Reach 75kg', status: 'active', currentValue: 79.8, targetValue: 75, unit: 'kg' },
//   { _id: 'g2', name: 'Body Fat 12%', status: 'active', currentValue: 15.8, targetValue: 12, unit: '%' },
//   { _id: 'g3', name: 'Bench 100kg', status: 'active', currentValue: 92, targetValue: 100, unit: 'kg' },
//   { _id: 'g4', name: 'Train 5x/week', status: 'active', currentValue: 4.2, targetValue: 5, unit: 'sessions' },
//   { _id: 'g5', name: 'Deadlift 150kg', status: 'achieved', currentValue: 150, targetValue: 150, unit: 'kg', achievedDate: '2025-10-30' },
// ];

// export const weeklyPlan: WorkoutPlanDay[] = [
//   { day: 'Monday', exercises: ['Bench Press', 'Shoulder Press', 'Tricep Dips'] },
//   { day: 'Tuesday', exercises: ['Pull-ups', 'Deadlift', 'Rows'] },
//   { day: 'Wednesday', exercises: [] },
//   { day: 'Thursday', exercises: ['Squat', 'Lunges', 'Leg Press'] },
//   { day: 'Friday', exercises: ['Push-ups', 'Dips', 'Cable Flyes'] },
//   { day: 'Saturday', exercises: [] },
//   { day: 'Sunday', exercises: [] },
// ];