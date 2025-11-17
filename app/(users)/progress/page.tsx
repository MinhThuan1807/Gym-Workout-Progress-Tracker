'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { SkeletonProgress } from '@/components/skeleton/SkeletonProgress'
import { Textarea } from '@/components/ui/textarea'
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Camera,
  Target,
  TrendingUp
} from 'lucide-react'
import { Separator } from '@radix-ui/react-separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { metricAPI } from '@/api/metric'
import { useSelector } from 'react-redux'
import {
  selectIsAuthenticated,
  selectCurrentUser
} from '@/store/slices/authSlice'
import ProgressPhotos from '@/components/progress/ProgressPhoto'

type TimeRange = '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL'

// ===== METRIC CONFIGURATIONS =====
const metricConfigs: Record<MetricType, MetricConfig> = {
  weight: {
    name: 'Weight',
    unit: 'kg',
    metricCode: 'weight',
    category: 'weight',
    goalDirection: 'down',
    color: '#10b981'
  },
  height: {
    name: 'Height',
    unit: 'cm',
    metricCode: 'height',
    category: 'measurements',
    color: '#6366f1'
  },
  body_fat: {
    name: 'Body Fat',
    unit: '%',
    metricCode: 'body_fat',
    category: 'body_composition',
    goalDirection: 'down',
    color: '#f59e0b'
  },
  muscle_mass: {
    name: 'Muscle Mass',
    unit: 'kg',
    metricCode: 'muscle_mass',
    category: 'body_composition',
    goalDirection: 'up',
    color: '#8b5cf6'
  },
  BMI: {
    name: 'BMI',
    unit: '',
    metricCode: 'BMI',
    category: 'weight',
    color: '#3b82f6'
  },
  waist_circumference: {
    name: 'Waist',
    unit: 'cm',
    metricCode: 'waist_circumference',
    category: 'measurements',
    goalDirection: 'down',
    color: '#ec4899'
  },
  hip_circumference: {
    name: 'Hip',
    unit: 'cm',
    metricCode: 'hip_circumference',
    category: 'measurements',
    color: '#14b8a6'
  },
  blood_pressure: {
    name: 'Blood Pressure',
    unit: 'mmHg',
    metricCode: 'blood_pressure',
    category: 'vitals',
    goalDirection: 'down',
    color: '#ef4444'
  },
  heart_rate: {
    name: 'Heart Rate',
    unit: 'bpm',
    metricCode: 'heart_rate',
    category: 'vitals',
    goalDirection: 'down',
    color: '#f97316'
  }
}

// ===== MOCK DATA =====
// const mockEntries: MetricEntry[] = [
//   // Weight entries
//   { _id: '1', date: '2025-09-01', metricType: 'weight', value: 84, notes: 'Starting point' },
//   { _id: '2', date: '2025-09-08', metricType: 'weight', value: 83.5 },
//   { _id: '3', date: '2025-09-15', metricType: 'weight', value: 83 },
//   { _id: '4', date: '2025-09-22', metricType: 'weight', value: 82.5, notes: 'Good progress!' },
//   { _id: '5', date: '2025-09-29', metricType: 'weight', value: 82 },
//   { _id: '6', date: '2025-10-06', metricType: 'weight', value: 81.5 },
//   { _id: '7', date: '2025-10-13', metricType: 'weight', value: 81 },
//   { _id: '8', date: '2025-10-20', metricType: 'weight', value: 80.5 },
//   { _id: '9', date: '2025-10-27', metricType: 'weight', value: 80 },
//   { _id: '10', date: '2025-11-03', metricType: 'weight', value: 79.8, notes: 'Feeling great!' },

//   // Body Fat entries
//   { _id: '11', date: '2025-09-01', metricType: 'bodyFat', value: 18 },
//   { _id: '12', date: '2025-09-15', metricType: 'bodyFat', value: 17.5 },
//   { _id: '13', date: '2025-09-29', metricType: 'bodyFat', value: 17 },
//   { _id: '14', date: '2025-10-13', metricType: 'bodyFat', value: 16.5 },
//   { _id: '15', date: '2025-10-27', metricType: 'bodyFat', value: 16 },
//   { _id: '16', date: '2025-11-03', metricType: 'bodyFat', value: 15.8 },

//   // Muscle Mass entries
//   { _id: '17', date: '2025-09-01', metricType: 'muscleMass', value: 68 },
//   { _id: '18', date: '2025-09-15', metricType: 'muscleMass', value: 68.5 },
//   { _id: '19', date: '2025-09-29', metricType: 'muscleMass', value: 69 },
//   { _id: '20', date: '2025-10-13', metricType: 'muscleMass', value: 69.5 },
//   { _id: '21', date: '2025-10-27', metricType: 'muscleMass', value: 70 },
//   { _id: '22', date: '2025-11-03', metricType: 'muscleMass', value: 70.3, notes: 'Gaining lean mass!' },

//   // Waist Circumference
//   { _id: '23', date: '2025-09-01', metricType: 'waistCircumference', value: 90 },
//   { _id: '24', date: '2025-09-15', metricType: 'waistCircumference', value: 89 },
//   { _id: '25', date: '2025-09-29', metricType: 'waistCircumference', value: 88 },
//   { _id: '26', date: '2025-10-13', metricType: 'waistCircumference', value: 87 },
//   { _id: '27', date: '2025-10-27', metricType: 'waistCircumference', value: 86 },
//   { _id: '28', date: '2025-11-03', metricType: 'waistCircumference', value: 85.5 },

//   // Heart Rate
//   { _id: '29', date: '2025-09-01', metricType: 'heartRate', value: 72 },
//   { _id: '30', date: '2025-09-15', metricType: 'heartRate', value: 70 },
//   { _id: '31', date: '2025-09-29', metricType: 'heartRate', value: 68 },
//   { _id: '32', date: '2025-10-13', metricType: 'heartRate', value: 66 },
//   { _id: '33', date: '2025-10-27', metricType: 'heartRate', value: 65 },
//   { _id: '34', date: '2025-11-03', metricType: 'heartRate', value: 64, notes: 'Resting HR improving' },
// ];

export default function ProgressPage() {
  const [entries, setEntries] = useState<MetricEntry[]>([])
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('weight')
  const [selectedCategory, setSelectedCategory] =
    useState<MetricCategory>('weight')
  const [selectedMetricCode, setSelectedMetricCode] =
    useState<MetricType>('weight')
  const [timeRange, setTimeRange] = useState<TimeRange>('3M')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [inputValue, setInputValue] = useState('')
  const [inputNotes, setInputNotes] = useState('')
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date())
  const [viewMode, setViewMode] = useState<'chart' | 'calendar' | 'photo'>(
    'chart'
  )
  const [isLoading, setIsLoading] = useState(false)

  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectCurrentUser)

  // Fetch all metrics on mount
  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true)
      try {
        const response = await metricAPI.getAll()
        // Normalize response to an array: some API clients return { data: [...] }, others return [...]
        const data = Array.isArray(response) ? response : response?.data ?? []
        setEntries(data)
      } catch (error: any) {
        console.error('Error fetching metrics:', error)
        toast.error(error.message || 'Failed to load metrics')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [isAuthenticated]) // ✅ Thêm dependency
  // Get available metrics for selected category
  const availableMetricsInCategory = useMemo(() => {
    return Object.entries(metricConfigs)
      .filter(([_, config]) => config.category === selectedCategory)
      .map(([key]) => key as MetricType)
  }, [selectedCategory])

  // Auto-select first metric in category when category changes
  useEffect(() => {
    if (availableMetricsInCategory.length > 0) {
      setSelectedMetricCode(availableMetricsInCategory[0])
    }
  }, [selectedCategory, availableMetricsInCategory])

  const primaryMetric = selectedMetricCode

  // Filter entries by time range
  const filteredEntries = useMemo(() => {
    const now = new Date()
    const entriesForMetric = entries.filter(
      (e) => e.metricCode === primaryMetric
    )

    if (timeRange === 'ALL') return entriesForMetric

    const daysMap: Record<TimeRange, number> = {
      '1W': 7,
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
      ALL: Infinity
    }

    const cutoffDate = new Date(now)
    cutoffDate.setDate(cutoffDate.getDate() - daysMap[timeRange])

    return entriesForMetric.filter((e) => {
      const entryDateStr = e.measureAt
      if (!entryDateStr) return false
      const entryDate = new Date(entryDateStr)
      return !isNaN(entryDate.getTime()) && entryDate >= cutoffDate
    })
  }, [entries, primaryMetric, timeRange])

  // Calculate statistics
  const stats = useMemo(() => {
    if (filteredEntries.length === 0) {
      return {
        current: 0,
        starting: 0,
        change: 0,
        changePercent: 0,
        best: 0,
        worst: 0
      }
    }

    const values = filteredEntries.map((e) => e.value)
    const current = values[0]
    const starting = values[values.length - 1]
    console.log(filteredEntries)
    const change = current - starting
    const changePercent = starting !== 0 ? (change / starting) * 100 : 0
    const best = Math.min(...values)
    const worst = Math.max(...values)

    return { current, starting, change, changePercent, best, worst }
  }, [filteredEntries])

  // Determine if trend is good based on goal direction
  const isTrendGood = useMemo(() => {
    const config = metricConfigs[primaryMetric]
    if (!config?.goalDirection) return null

    if (config.goalDirection === 'down') {
      return stats.change < 0
    } else {
      return stats.change > 0
    }
  }, [primaryMetric, stats.change])

  // Format chart data
  const chartData = useMemo(() => {
    return filteredEntries.map((entry) => {
      const dateStr = entry.measureAt
      const date = dateStr ? new Date(dateStr) : new Date()

      return {
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        value: entry.value,
        fullDate: dateStr,
        notes: entry.note
      }
    })
    .reverse()
  }, [filteredEntries])

  // Calculate trend line using linear regression
  const trendLine = useMemo(() => {
    if (chartData.length < 2) return []

    const n = chartData.length
    const sumX = chartData.reduce((sum, _, i) => sum + i, 0)
    const sumY = chartData.reduce((sum, d) => sum + d.value, 0)
    const sumXY = chartData.reduce((sum, d, i) => sum + i * d.value, 0)
    const sumXX = chartData.reduce((sum, _, i) => sum + i * i, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    return chartData.map((d, i) => ({
      date: d.date,
      trend: slope * i + intercept
    }))
  }, [chartData])

  // Merge chart data with trend line
  const mergedChartData = useMemo(() => {
    return chartData.map((d, i) => ({
      ...d,
      trend: trendLine[i]?.trend
    }))
  }, [chartData, trendLine])

  // Get recent entries for s_idebar
  const recentEntries = useMemo(() => {
    return [...entries]
      .sort(
        (a, b) =>
          new Date(b.measureAt).getTime() - new Date(a.measureAt).getTime()
      )
      .slice(0, 10)
  }, [entries])

  const handleLogEntry = async () => {
    // ✅ Check auth trước
    if (!isAuthenticated) {
      toast.error('Please login first')
      return
    }

    try {
      setIsLoading(true)

      const value = parseFloat(inputValue)
      if (isNaN(value)) {
        toast.error('Please enter a valid number')
        return
      }

      const config = metricConfigs[selectedMetric]

      const data = {
        metricCode: config.metricCode,
        value: value,
        unit: config.unit,
        note: inputNotes,
        measureAt: selectedDate.toISOString()
      }

      await metricAPI.logMetric(data)

      toast.success('Metric logged successfully!')

      // ✅ Refresh data sau khi log
      const response = await metricAPI.getAll()
      setEntries(response.data)

      // Reset form
      setInputValue('')
      setInputNotes('')
    } catch (error: any) {
      console.error('Error logging metric:', error)
      toast.error(error.message || 'Failed to log metric')
    } finally {
      setIsLoading(false)
    }
  }

  const config = metricConfigs[selectedMetricCode]
  const trendColor =
    isTrendGood === null ? config?.color : isTrendGood ? '#10b981' : '#ef4444'

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
      {/* LEFT SIDEBAR - 350px on desktop, full width on mobile */}
      <div className="w-full lg:w-[350px] shrink-0 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-1">Progress</h1>
          <p className="text-sm sm:text-base text-[#6b7280]">
            Track your fitness metrics
          </p>
        </div>

        <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg text-[#111827]">
              Log Metric
            </CardTitle>
            <p className="text-xs sm:text-sm text-[#6b7280]">
              Record your measurements
            </p>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
            {/* Metric Selector */}
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm text-[#111827]">
                Metric
              </Label>
              <Select
                value={selectedMetric}
                onValueChange={(value) =>
                  setSelectedMetric(value as MetricType)
                }
              >
                <SelectTrigger className="rounded-xl border-[#e5e7eb] bg-white h-9 sm:h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(metricConfigs).map(([key, config]) => (
                    <SelectItem key={key} value={key} className="text-sm">
                      {config.metricCode} ({config.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm text-[#111827]">Date</Label>
              <Input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="rounded-xl border-[#e5e7eb] h-9 sm:h-10 text-sm"
              />
            </div>

            {/* Value Input */}
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm text-[#111827]">
                Value
                {metricConfigs[selectedMetric].unit && (
                  <span className="text-[#6b7280] ml-2">
                    ({metricConfigs[selectedMetric].unit})
                  </span>
                )}
              </Label>
              <Input
                type="number"
                step="0.1"
                placeholder="Enter value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="rounded-xl border-[#e5e7eb] h-9 sm:h-10 text-sm"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm text-[#111827]">
                Notes (Optional)
              </Label>
              <Textarea
                placeholder="Add any observations..."
                value={inputNotes}
                onChange={(e) => setInputNotes(e.target.value)}
                className="rounded-xl border-[#e5e7eb] min-h-[60px] sm:min-h-20 text-sm"
              />
            </div>

            {/* Log Button */}
            <Button
              className="w-full rounded-xl bg-[#10b981] hover:bg-[#059669] h-9 sm:h-10 text-sm sm:text-base"
              onClick={handleLogEntry}
              disabled={!inputValue}
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Logging...
                </>
              ) : (
                <>
                  <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Log Entry
                </>
              )}
            </Button>

            <Separator />

            {/* Recent Entries */}
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm text-[#111827]">
                Recent Entries
              </Label>
              <ScrollArea className="h-[150px] sm:h-[200px] rounded-xl border border-[#e5e7eb] p-2 sm:p-3">
                <div className="space-y-2">
                  {recentEntries.map((entry) => (
                    <div
                      key={entry._id}
                      className="p-2 rounded-lg bg-[#f9fafb] hover:bg-[#f3f4f6] transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-xs sm:text-sm text-[#111827]">
                            {entry.metricCode}
                          </div>
                          <div className="text-[10px] sm:text-xs text-[#6b7280]">
                            {(() => {
                              const dateStr = entry.measureAt
                              if (!dateStr) return 'No date'
                              const date = new Date(dateStr)
                              return isNaN(date.getTime())
                                ? 'Invalid date'
                                : date.toLocaleDateString()
                            })()}
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm text-[#111827]">
                          {entry.value} {entry.unit}
                        </div>
                      </div>
                      {entry.note && (
                        <div className="text-[10px] sm:text-xs text-[#6b7280] mt-1 italic">
                          {entry.note}
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
      <div className="flex-1 overflow-auto space-y-4 sm:space-y-6">
        {/* View Mode Toggle */}
        <div className="flex justify-end gap-2">
          <Button
            variant={viewMode === 'chart' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('chart')}
            className="rounded-xl text-xs sm:text-sm h-8 sm:h-9"
          >
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Charts</span>
            <span className="sm:hidden">Chart</span>
          </Button>
          <Button
            variant={viewMode === 'photo' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('photo')}
            className="rounded-xl text-xs sm:text-sm h-8 sm:h-9"
          >
            <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Photo
          </Button>
        </div>

        {viewMode === 'chart' ? (
          <>
            {/* Metric metricCode Tabs */}
            <Tabs
              value={selectedCategory}
              onValueChange={(value) =>
                setSelectedCategory(value as MetricCategory)
              }
            >
              <TabsList className="inline-flex bg-[#e5e7eb]/50 rounded-xl p-1 overflow-x-auto w-full sm:w-auto">
                <TabsTrigger
                  value="weight"
                  className="rounded-xl text-xs sm:text-sm whitespace-nowrap"
                >
                  Weight
                </TabsTrigger>
                <TabsTrigger
                  value="body_composition"
                  className="rounded-xl text-xs sm:text-sm whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Body Composition</span>
                  <span className="sm:hidden">Body</span>
                </TabsTrigger>
                <TabsTrigger
                  value="measurements"
                  className="rounded-xl text-xs sm:text-sm whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Measurements</span>
                  <span className="sm:hidden">Measure</span>
                </TabsTrigger>
                <TabsTrigger
                  value="vitals"
                  className="rounded-xl text-xs sm:text-sm whitespace-nowrap"
                >
                  Vitals
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value={selectedCategory}
                className="mt-4 sm:mt-6 space-y-4 sm:space-y-6"
              >
                {/* Metric Selector - Show available metrics in category */}
                {availableMetricsInCategory.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {availableMetricsInCategory.map((metricKey) => {
                      const metricConfig = metricConfigs[metricKey]
                      return (
                        <Button
                          key={metricKey}
                          variant={
                            selectedMetricCode === metricKey
                              ? 'default'
                              : 'outline'
                          }
                          size="sm"
                          onClick={() => setSelectedMetricCode(metricKey)}
                          className="rounded-xl text-xs sm:text-sm whitespace-nowrap shrink-0"
                          style={
                            selectedMetricCode === metricKey
                              ? {
                                  backgroundColor: metricConfig.color,
                                  borderColor: metricConfig.color
                                }
                              : {}
                          }
                        >
                          {metricConfig.name}
                        </Button>
                      )
                    })}
                  </div>
                )}
                {/* Chart Card */}
                <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                      <div>
                        <CardTitle className="text-base sm:text-lg text-[#111827]">
                          {config?.name} Trend
                        </CardTitle>
                        <p className="text-xs sm:text-sm text-[#6b7280]">
                          {filteredEntries.length} entries in selected time
                          range
                        </p>
                      </div>
                      {/* Time Range Selector */}
                      <div className="flex gap-1 bg-[#e5e7eb]/50 p-1 rounded-xl overflow-x-auto">
                        {(
                          ['1W', '1M', '3M', '6M', '1Y', 'ALL'] as TimeRange[]
                        ).map((range) => (
                          <Button
                            key={range}
                            variant={timeRange === range ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setTimeRange(range)}
                            className={`rounded-lg px-2 sm:px-3 h-7 sm:h-8 text-xs whitespace-nowrap ${
                              timeRange === range
                                ? 'bg-[#10b981] hover:bg-[#059669]'
                                : ''
                            }`}
                          >
                            {range}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-6">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer
                        width="100%"
                        height={300}
                        className="sm:h-[400px]"
                      >
                        <LineChart data={mergedChartData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis
                            dataKey="date"
                            stroke="#6b7280"
                            style={{ fontSize: '10px' }}
                            className="sm:text-xs"
                          />
                          <YAxis
                            stroke="#6b7280"
                            style={{ fontSize: '10px' }}
                            className="sm:text-xs"
                            label={{
                              value: config.unit,
                              angle: -90,
                              position: 'insideLeft',
                              style: { fill: '#6b7280', fontSize: '10px' }
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
                                const data = payload[0].payload
                                return (
                                  <div className="bg-white border border-[#e5e7eb] rounded-xl p-2 sm:p-3 shadow-lg">
                                    <p className="text-xs sm:text-sm text-[#111827]">
                                      {data.value} {config.unit}
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-[#6b7280]">
                                      {data.measureAt}
                                    </p>
                                    {data.note && (
                                      <p className="text-[10px] sm:text-xs text-[#6b7280] mt-1 italic">
                                        {data.note}
                                      </p>
                                    )}
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Legend
                            wrapperStyle={{ fontSize: '10px' }}
                            className="sm:text-xs"
                          />
                          {/* Actual data line */}
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={trendColor}
                            strokeWidth={2}
                            className="sm:stroke-3"
                            name={`${config.metricCode} (${config.unit})`}
                            dot={{
                              fill: trendColor,
                              r: 3,
                              cursor: 'pointer'
                            }}
                            activeDot={{ r: 5 }}
                          />
                          {/* Trend line */}
                          <Line
                            type="monotone"
                            dataKey="trend"
                            stroke={trendColor}
                            strokeWidth={1.5}
                            className="sm:stroke-2"
                            strokeDasharray="5 5"
                            name="Trend"
                            dot={false}
                            opacity={0.5}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] sm:h-[400px] flex items-center justify-center text-sm sm:text-base text-[#6b7280]">
                        No data available for this time range
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* Current Value */}
                  <Card className="rounded-2xl border-[#e5e7eb] bg-white">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <Target className="w-3 h-3 sm:w-4 sm:h-4 text-[#10b981]" />
                        <p className="text-[10px] sm:text-xs text-[#6b7280]">
                          Current
                        </p>
                      </div>
                      <p className="text-lg sm:text-2xl text-[#111827]">
                        {stats.current.toFixed(1)}
                        <span className="text-xs sm:text-sm text-[#6b7280] ml-1">
                          {config?.unit}
                        </span>
                      </p>
                    </CardContent>
                  </Card>

                  {/* Starting Value */}
                  <Card className="rounded-2xl border-[#e5e7eb] bg-white">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-[#3b82f6]" />
                        <p className="text-[10px] sm:text-xs text-[#6b7280]">
                          Starting
                        </p>
                      </div>
                      <p className="text-lg sm:text-2xl text-[#111827]">
                        {stats.starting.toFixed(1)}
                        <span className="text-xs sm:text-sm text-[#6b7280] ml-1">
                          {config?.unit}
                        </span>
                      </p>
                    </CardContent>
                  </Card>

                  {/* Change */}
                  <Card className="rounded-2xl border-[#e5e7eb] bg-white">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        {stats.change < 0 ? (
                          <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 text-[#10b981]" />
                        ) : (
                          <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 text-[#ef4444]" />
                        )}
                        <p className="text-[10px] sm:text-xs text-[#6b7280]">
                          Change
                        </p>
                      </div>
                      <p
                        className={`text-lg sm:text-2xl ${
                          isTrendGood ? 'text-[#10b981]' : 'text-[#ef4444]'
                        }`}
                      >
                        {stats.change > 0 ? '+' : ''}
                        {stats.change.toFixed(1)}
                        <span className="text-xs sm:text-sm text-[#6b7280] ml-1">
                          {config?.unit}
                        </span>
                      </p>
                      <p
                        className={`text-[10px] sm:text-xs ${
                          isTrendGood ? 'text-[#10b981]' : 'text-[#ef4444]'
                        }`}
                      >
                        {stats.changePercent > 0 ? '+' : ''}
                        {stats.changePercent.toFixed(1)}%
                      </p>
                    </CardContent>
                  </Card>

                  {/* Best/Worst */}
                  <Card className="rounded-2xl border-[#e5e7eb] bg-white">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-[#f59e0b]" />
                        <p className="text-[10px] sm:text-xs text-[#6b7280]">
                          {config?.goalDirection === 'down' ? 'Best' : 'Peak'}
                        </p>
                      </div>
                      <p className="text-lg sm:text-2xl text-[#111827]">
                        {(config?.goalDirection === 'down'
                          ? stats.best
                          : stats.worst
                        ).toFixed(1)}
                        <span className="text-xs sm:text-sm text-[#6b7280] ml-1">
                          {config?.unit}
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          /* PHOTO */
          <ProgressPhotos />
        )}
      </div>
    </div>
  )
}
