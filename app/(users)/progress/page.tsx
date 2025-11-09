'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {  Suspense, useMemo, useState } from "react";
import { SkeletonProgress } from "@/components/skeleton/SkeletonProgress";
import { Textarea } from "@/components/ui/textarea";
import { Activity, ArrowDown, ArrowUp, CalendarIcon, Target, TrendingUp } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// ===== TYPES =====
type MetricType = 
  | 'weight' 
  | 'height' 
  | 'bodyFat' 
  | 'muscleMass' 
  | 'bmi' 
  | 'waistCircumference' 
  | 'hipCircumference' 
  | 'bloodPressure' 
  | 'heartRate';

type MetricCategory = 'weight' | 'bodyFat' | 'measurements' | 'vitals';

type TimeRange = '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';

// ===== METRIC CONFIGURATIONS =====
const metricConfigs: Record<MetricType, MetricConfig> = {
  weight: { name: 'Weight', unit: 'kg', category: 'weight', goalDirection: 'down', color: '#10b981' },
  height: { name: 'Height', unit: 'cm', category: 'measurements', color: '#6366f1' },
  bodyFat: { name: 'Body Fat', unit: '%', category: 'bodyFat', goalDirection: 'down', color: '#f59e0b' },
  muscleMass: { name: 'Muscle Mass', unit: 'kg', category: 'bodyFat', goalDirection: 'up', color: '#8b5cf6' },
  bmi: { name: 'BMI', unit: '', category: 'weight', color: '#3b82f6' },
  waistCircumference: { name: 'Waist Circumference', unit: 'cm', category: 'measurements', goalDirection: 'down', color: '#ec4899' },
  hipCircumference: { name: 'Hip Circumference', unit: 'cm', category: 'measurements', color: '#14b8a6' },
  bloodPressure: { name: 'Blood Pressure', unit: 'mmHg', category: 'vitals', goalDirection: 'down', color: '#ef4444' },
  heartRate: { name: 'Heart Rate', unit: 'bpm', category: 'vitals', goalDirection: 'down', color: '#f97316' },
};

// ===== MOCK DATA =====
const mockEntries: MetricEntry[] = [
  // Weight entries
  { id: '1', date: '2025-09-01', metricType: 'weight', value: 84, notes: 'Starting point' },
  { id: '2', date: '2025-09-08', metricType: 'weight', value: 83.5 },
  { id: '3', date: '2025-09-15', metricType: 'weight', value: 83 },
  { id: '4', date: '2025-09-22', metricType: 'weight', value: 82.5, notes: 'Good progress!' },
  { id: '5', date: '2025-09-29', metricType: 'weight', value: 82 },
  { id: '6', date: '2025-10-06', metricType: 'weight', value: 81.5 },
  { id: '7', date: '2025-10-13', metricType: 'weight', value: 81 },
  { id: '8', date: '2025-10-20', metricType: 'weight', value: 80.5 },
  { id: '9', date: '2025-10-27', metricType: 'weight', value: 80 },
  { id: '10', date: '2025-11-03', metricType: 'weight', value: 79.8, notes: 'Feeling great!' },

  // Body Fat entries
  { id: '11', date: '2025-09-01', metricType: 'bodyFat', value: 18 },
  { id: '12', date: '2025-09-15', metricType: 'bodyFat', value: 17.5 },
  { id: '13', date: '2025-09-29', metricType: 'bodyFat', value: 17 },
  { id: '14', date: '2025-10-13', metricType: 'bodyFat', value: 16.5 },
  { id: '15', date: '2025-10-27', metricType: 'bodyFat', value: 16 },
  { id: '16', date: '2025-11-03', metricType: 'bodyFat', value: 15.8 },

  // Muscle Mass entries
  { id: '17', date: '2025-09-01', metricType: 'muscleMass', value: 68 },
  { id: '18', date: '2025-09-15', metricType: 'muscleMass', value: 68.5 },
  { id: '19', date: '2025-09-29', metricType: 'muscleMass', value: 69 },
  { id: '20', date: '2025-10-13', metricType: 'muscleMass', value: 69.5 },
  { id: '21', date: '2025-10-27', metricType: 'muscleMass', value: 70 },
  { id: '22', date: '2025-11-03', metricType: 'muscleMass', value: 70.3, notes: 'Gaining lean mass!' },

  // Waist Circumference
  { id: '23', date: '2025-09-01', metricType: 'waistCircumference', value: 90 },
  { id: '24', date: '2025-09-15', metricType: 'waistCircumference', value: 89 },
  { id: '25', date: '2025-09-29', metricType: 'waistCircumference', value: 88 },
  { id: '26', date: '2025-10-13', metricType: 'waistCircumference', value: 87 },
  { id: '27', date: '2025-10-27', metricType: 'waistCircumference', value: 86 },
  { id: '28', date: '2025-11-03', metricType: 'waistCircumference', value: 85.5 },

  // Heart Rate
  { id: '29', date: '2025-09-01', metricType: 'heartRate', value: 72 },
  { id: '30', date: '2025-09-15', metricType: 'heartRate', value: 70 },
  { id: '31', date: '2025-09-29', metricType: 'heartRate', value: 68 },
  { id: '32', date: '2025-10-13', metricType: 'heartRate', value: 66 },
  { id: '33', date: '2025-10-27', metricType: 'heartRate', value: 65 },
  { id: '34', date: '2025-11-03', metricType: 'heartRate', value: 64, notes: 'Resting HR improving' },
];


export default function ProgressPage() {
    const [entries] = useState<MetricEntry[]>(mockEntries);
    const [selectedMetric, setSelectedMetric] = useState<MetricType>('weight');
    const [selectedCategory, setSelectedCategory] = useState<MetricCategory>('weight');
    const [timeRange, setTimeRange] = useState<TimeRange>('3M');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [inputValue, setInputValue] = useState('');
    const [inputNotes, setInputNotes] = useState('');
    const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
    const [viewMode, setViewMode] = useState<'chart' | 'calendar'>('chart');

    // Get entries for selected category
    const categoryEntries = useMemo(() => {
        const metricTypes = Object.entries(metricConfigs)
        .filter(([_, config]) => config.category === selectedCategory)
        .map(([type]) => type as MetricType);
        
        return entries.filter(e => metricTypes.includes(e.metricType));
    }, [entries, selectedCategory]);

    // Get primary metric for selected category
    const primaryMetric = useMemo(() => {
        switch(selectedCategory) {
        case 'weight': return 'weight';
        case 'bodyFat': return 'bodyFat';
        case 'measurements': return 'waistCircumference';
        case 'vitals': return 'heartRate';
        default: return 'weight';
        }
    }, [selectedCategory]);

    // Filter entries by time range
    const filteredEntries = useMemo(() => {
        const now = new Date();
        const entriesForMetric = entries.filter(e => e.metricType === primaryMetric);
        
        if (timeRange === 'ALL') return entriesForMetric;
        
        const daysMap: Record<TimeRange, number> = {
        '1W': 7,
        '1M': 30,
        '3M': 90,
        '6M': 180,
        '1Y': 365,
        'ALL': Infinity
        };
        
        const cutoffDate = new Date(now);
        cutoffDate.setDate(cutoffDate.getDate() - daysMap[timeRange]);
        
        return entriesForMetric.filter(e => new Date(e.date) >= cutoffDate);
    }, [entries, primaryMetric, timeRange]);

    // Calculate statistics
    const stats = useMemo(() => {
        if (filteredEntries.length === 0) {
        return { current: 0, starting: 0, change: 0, changePercent: 0, best: 0, worst: 0 };
        }

        const values = filteredEntries.map(e => e.value);
        const current = values[values.length - 1];
        const starting = values[0];
        const change = current - starting;
        const changePercent = starting !== 0 ? (change / starting) * 100 : 0;
        const best = Math.min(...values);
        const worst = Math.max(...values);

        return { current, starting, change, changePercent, best, worst };
    }, [filteredEntries]);

    // Determine if trend is good based on goal direction
    const isTrendGood = useMemo(() => {
        const config = metricConfigs[primaryMetric];
        if (!config.goalDirection) return null;
        
        if (config.goalDirection === 'down') {
        return stats.change < 0;
        } else {
        return stats.change > 0;
        }
    }, [primaryMetric, stats.change]);

    // Format chart data
    const chartData = useMemo(() => {
        return filteredEntries.map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: entry.value,
        fullDate: entry.date,
        notes: entry.notes
        }));
    }, [filteredEntries]);

    // Calculate trend line using linear regression
    const trendLine = useMemo(() => {
        if (chartData.length < 2) return [];

        const n = chartData.length;
        const sumX = chartData.reduce((sum, _, i) => sum + i, 0);
        const sumY = chartData.reduce((sum, d) => sum + d.value, 0);
        const sumXY = chartData.reduce((sum, d, i) => sum + i * d.value, 0);
        const sumXX = chartData.reduce((sum, _, i) => sum + i * i, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return chartData.map((d, i) => ({
        date: d.date,
        trend: slope * i + intercept
        }));
    }, [chartData]);

    // Merge chart data with trend line
    const mergedChartData = useMemo(() => {
        return chartData.map((d, i) => ({
        ...d,
        trend: trendLine[i]?.trend
        }));
    }, [chartData, trendLine]);

    // Get recent entries for sidebar
    const recentEntries = useMemo(() => {
        return [...entries]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    }, [entries]);

    // Get dates with logged metrics for calendar
    const loggedDates = useMemo(() => {
        return entries.map(e => new Date(e.date));
    }, [entries]);

    // Get entries for selected calendar date
    const entriesForSelectedDate = useMemo(() => {
        if (!calendarDate) return [];
        const dateStr = calendarDate.toISOString().split('T')[0];
        return entries.filter(e => e.date === dateStr);
    }, [calendarDate, entries]);

    const handleLogEntry = () => {
        // Logic to save entry would go here
        console.log('Logging entry:', {
        date: selectedDate.toISOString().split('T')[0],
        metricType: selectedMetric,
        value: parseFloat(inputValue),
        notes: inputNotes
        });
        setInputValue('');
        setInputNotes('');
    };

    const config = metricConfigs[primaryMetric];
    const trendColor = isTrendGood === null ? config.color : (isTrendGood ? '#10b981' : '#ef4444');


  return (
    <div className="flex gap-6 ">
      {/* LEFT SIDEBAR - 350px */}
      <div className="w-[350px] flex-shrink-0 space-y-6">
        <div>
          <h1 className="text-3xl mb-1">Progress</h1>
          <p className="text-[#6b7280]">Track your fitness metrics</p>
        </div>

        <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-[#111827]">Log Metric</CardTitle>
            <p className="text-sm text-[#6b7280]">Record your measurements</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Metric Selector */}
            <div className="space-y-2">
              <Label className="text-[#111827]">Metric</Label>
              <Select value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as MetricType)}>
                <SelectTrigger className="rounded-xl border-[#e5e7eb] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(metricConfigs).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.name} ({config.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <Label className="text-[#111827]">Date</Label>
              <Input 
                type="date" 
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="rounded-xl border-[#e5e7eb]"
              />
            </div>

            {/* Value Input */}
            <div className="space-y-2">
              <Label className="text-[#111827]">
                Value 
                {metricConfigs[selectedMetric].unit && (
                  <span className="text-[#6b7280] ml-2">({metricConfigs[selectedMetric].unit})</span>
                )}
              </Label>
              <Input 
                type="number"
                step="0.1"
                placeholder="Enter value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="rounded-xl border-[#e5e7eb]"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-[#111827]">Notes (Optional)</Label>
              <Textarea 
                placeholder="Add any observations..."
                value={inputNotes}
                onChange={(e) => setInputNotes(e.target.value)}
                className="rounded-xl border-[#e5e7eb] min-h-[80px]"
              />
            </div>

            {/* Log Button */}
            <Button 
              className="w-full rounded-xl bg-[#10b981] hover:bg-[#059669]"
              onClick={handleLogEntry}
              disabled={!inputValue}
            >
              <Activity className="w-4 h-4 mr-2" />
              Log Entry
            </Button>

            <Separator />

            {/* Recent Entries */}
            <div className="space-y-2">
              <Label className="text-[#111827]">Recent Entries</Label>
              <ScrollArea className="h-[200px] rounded-xl border border-[#e5e7eb] p-3">
                <div className="space-y-2">
                  {recentEntries.map((entry) => (
                    <div 
                      key={entry.id}
                      className="p-2 rounded-lg bg-[#f9fafb] hover:bg-[#f3f4f6] transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-sm text-[#111827]">
                            {metricConfigs[entry.metricType as MetricType].name}
                          </div>
                          <div className="text-xs text-[#6b7280]">
                            {new Date(entry.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-sm text-[#111827]">
                          {entry.value} {metricConfigs[entry.metricType as MetricType].unit}
                        </div>
                      </div>
                      {entry.notes && (
                        <div className="text-xs text-[#6b7280] mt-1 italic">
                          {entry.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 overflow-auto space-y-6">
        {/* View Mode Toggle */}
        <div className="flex justify-end gap-2">
          <Button
            variant={viewMode === 'chart' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('chart')}
            className="rounded-xl"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Charts
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            className="rounded-xl"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Calendar
          </Button>
        </div>

        {viewMode === 'chart' ? (
          <>
            {/* Metric Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as MetricCategory)}>
              <TabsList className="inline-flex bg-[#e5e7eb]/50 rounded-xl p-1">
                <TabsTrigger value="weight" className="rounded-xl">Weight</TabsTrigger>
                <TabsTrigger value="bodyFat" className="rounded-xl">Body Composition</TabsTrigger>
                <TabsTrigger value="measurements" className="rounded-xl">Measurements</TabsTrigger>
                <TabsTrigger value="vitals" className="rounded-xl">Vitals</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedCategory} className="mt-6 space-y-6">
                {/* Chart Card */}
                <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-[#111827]">{config.name} Trend</CardTitle>
                        <p className="text-sm text-[#6b7280]">Track your progress over time</p>
                      </div>
                      {/* Time Range Selector */}
                      <div className="flex gap-1 bg-[#e5e7eb]/50 p-1 rounded-xl">
                        {(['1W', '1M', '3M', '6M', '1Y', 'ALL'] as TimeRange[]).map((range) => (
                          <Button
                            key={range}
                            variant={timeRange === range ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setTimeRange(range)}
                            className={`rounded-lg px-3 h-8 ${timeRange === range ? 'bg-[#10b981] hover:bg-[#059669]' : ''}`}
                          >
                            {range}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={mergedChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                          />
                          <YAxis 
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                            label={{ 
                              value: config.unit, 
                              angle: -90, 
                              position: 'insideLeft',
                              style: { fill: '#6b7280' }
                            }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#ffffff', 
                              border: '1px solid #e5e7eb',
                              borderRadius: '0.75rem',
                              padding: '8px 12px'
                            }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-white border border-[#e5e7eb] rounded-xl p-3 shadow-lg">
                                    <p className="text-sm text-[#111827]">
                                      {data.value} {config.unit}
                                    </p>
                                    <p className="text-xs text-[#6b7280]">{data.date}</p>
                                    {data.notes && (
                                      <p className="text-xs text-[#6b7280] mt-1 italic">
                                        {data.notes}
                                      </p>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Legend />
                          {/* Actual data line */}
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke={trendColor}
                            strokeWidth={3}
                            name={`${config.name} (${config.unit})`}
                            dot={{ 
                              fill: trendColor, 
                              r: 5,
                              cursor: 'pointer'
                            }}
                            activeDot={{ r: 7 }}
                          />
                          {/* Trend line */}
                          <Line 
                            type="monotone" 
                            dataKey="trend" 
                            stroke={trendColor}
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Trend"
                            dot={false}
                            opacity={0.5}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[400px] flex items-center justify-center text-[#6b7280]">
                        No data available for this time range
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Current Value */}
                  <Card className="rounded-2xl border-[#e5e7eb] bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-[#10b981]" />
                        <p className="text-xs text-[#6b7280]">Current</p>
                      </div>
                      <p className="text-2xl text-[#111827]">
                        {stats.current.toFixed(1)}
                        <span className="text-sm text-[#6b7280] ml-1">{config.unit}</span>
                      </p>
                    </CardContent>
                  </Card>

                  {/* Starting Value */}
                  <Card className="rounded-2xl border-[#e5e7eb] bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-[#3b82f6]" />
                        <p className="text-xs text-[#6b7280]">Starting</p>
                      </div>
                      <p className="text-2xl text-[#111827]">
                        {stats.starting.toFixed(1)}
                        <span className="text-sm text-[#6b7280] ml-1">{config.unit}</span>
                      </p>
                    </CardContent>
                  </Card>

                  {/* Change */}
                  <Card className="rounded-2xl border-[#e5e7eb] bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {stats.change < 0 ? (
                          <ArrowDown className="w-4 h-4 text-[#10b981]" />
                        ) : (
                          <ArrowUp className="w-4 h-4 text-[#ef4444]" />
                        )}
                        <p className="text-xs text-[#6b7280]">Change</p>
                      </div>
                      <p className={`text-2xl ${isTrendGood ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                        {stats.change > 0 ? '+' : ''}{stats.change.toFixed(1)}
                        <span className="text-sm text-[#6b7280] ml-1">{config.unit}</span>
                      </p>
                      <p className={`text-xs ${isTrendGood ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                        {stats.changePercent > 0 ? '+' : ''}{stats.changePercent.toFixed(1)}%
                      </p>
                    </CardContent>
                  </Card>

                  {/* Best/Worst */}
                  <Card className="rounded-2xl border-[#e5e7eb] bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-[#f59e0b]" />
                        <p className="text-xs text-[#6b7280]">
                          {config.goalDirection === 'down' ? 'Best' : 'Peak'}
                        </p>
                      </div>
                      <p className="text-2xl text-[#111827]">
                        {(config.goalDirection === 'down' ? stats.best : stats.worst).toFixed(1)}
                        <span className="text-sm text-[#6b7280] ml-1">{config.unit}</span>
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          /* CALENDAR VIEW */
          <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-[#111827]">Metrics Calendar</CardTitle>
              <p className="text-sm text-[#6b7280]">Days with logged metrics are highlighted</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={calendarDate}
                    onSelect={setCalendarDate}
                    className="rounded-xl border border-[#e5e7eb]"
                    modifiers={{
                      logged: loggedDates
                    }}
                    modifiersClassNames={{
                      logged: "bg-[#10b981] text-white hover:bg-[#059669] relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-white after:rounded-full"
                    }}
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg text-[#111827] mb-2">
                      {calendarDate?.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <p className="text-sm text-[#6b7280]">
                      {entriesForSelectedDate.length} {entriesForSelectedDate.length === 1 ? 'entry' : 'entries'} logged
                    </p>
                  </div>
                  <Separator />
                  {entriesForSelectedDate.length > 0 ? (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {entriesForSelectedDate.map((entry) => (
                          <Card key={entry.id} className="rounded-xl border-[#e5e7eb] bg-[#f9fafb]">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="text-[#111827]">
                                    {metricConfigs[entry.metricType as MetricType].name}
                                  </h4>
                                  <Badge 
                                    className="mt-1 rounded-lg text-xs"
                                    style={{ backgroundColor: metricConfigs[entry.metricType as MetricType].color }}
                                  >
                                    {metricConfigs[entry.metricType as MetricType].category}
                                  </Badge>
                                </div>
                                <div className="text-xl text-[#111827]">
                                  {entry.value} 
                                  <span className="text-sm text-[#6b7280] ml-1">
                                    {metricConfigs[entry.metricType as MetricType].unit}
                                  </span>
                                </div>
                              </div>
                              {entry.notes && (
                                <p className="text-sm text-[#6b7280] italic mt-2">
                                  {entry.notes}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="h-[400px] flex items-center justify-center text-[#6b7280]">
                      No metrics logged on this day
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
