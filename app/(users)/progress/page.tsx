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
  const [viewMode, setViewMode] = useState<'chart' | 'calendar' | 'photo'>('chart')
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

  // Get dates with logged metrics for calendar
  const loggedDates = useMemo(() => {
    return entries
      .map((e) => {
        const dateStr = e.measureAt
        if (!dateStr) return null
        const date = new Date(dateStr)
        return isNaN(date.getTime()) ? null : date
      })
      .filter((date): date is Date => date !== null)
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
    <div className="flex gap-6 ">
      {/* LEFT S_IDEBAR - 350px */}
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
              <Select
                value={selectedMetric}
                onValueChange={(value) =>
                  setSelectedMetric(value as MetricType)
                }
              >
                <SelectTrigger className="rounded-xl border-[#e5e7eb] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(metricConfigs).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.metricCode} ({config.unit})
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
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Logging...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4 mr-2" />
                  Log Entry
                </>
              )}
            </Button>

            <Separator />

            {/* Recent Entries */}
            <div className="space-y-2">
              <Label className="text-[#111827]">Recent Entries</Label>
              <ScrollArea className="h-[200px] rounded-xl border border-[#e5e7eb] p-3">
                <div className="space-y-2">
                  {recentEntries.map((entry) => (
                    <div
                      key={entry._id}
                      className="p-2 rounded-lg bg-[#f9fafb] hover:bg-[#f3f4f6] transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-sm text-[#111827]">
                            {/* {metricConfigs[entry.metricType as MetricType].name} */}
                            {entry.metricCode}
                          </div>
                          <div className="text-xs text-[#6b7280]">
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
                        <div className="text-sm text-[#111827]">
                          {/* {entry.value} {metricConfigs[entry.metricType as MetricType].unit} */}
                          {entry.value} {entry.unit}
                        </div>
                      </div>
                      {entry.note && (
                        <div className="text-xs text-[#6b7280] mt-1 italic">
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
            variant={viewMode === 'photo' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('photo')}
            className="rounded-xl"
          >
            <Camera className="w-4 h-4 mr-2" />
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
              <TabsList className="inline-flex bg-[#e5e7eb]/50 rounded-xl p-1">
                <TabsTrigger value="weight" className="rounded-xl">
                  Weight
                </TabsTrigger>
                <TabsTrigger value="body_composition" className="rounded-xl">
                  Body Composition
                </TabsTrigger>
                <TabsTrigger value="measurements" className="rounded-xl">
                  Measurements
                </TabsTrigger>
                <TabsTrigger value="vitals" className="rounded-xl">
                  Vitals
                </TabsTrigger>
              </TabsList>

              <TabsContent value={selectedCategory} className="mt-6 space-y-6">
                {/* Metric Selector - Show available metrics in category */}
                {availableMetricsInCategory.length > 1 && (
                  <div className="flex gap-2">
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
                          className="rounded-xl"
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
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-[#111827]">
                          {config?.name} Trend
                        </CardTitle>
                        <p className="text-sm text-[#6b7280]">
                          {filteredEntries.length} entries in selected time
                          range
                        </p>
                      </div>
                      {/* Time Range Selector */}
                      <div className="flex gap-1 bg-[#e5e7eb]/50 p-1 rounded-xl">
                        {(
                          ['1W', '1M', '3M', '6M', '1Y', 'ALL'] as TimeRange[]
                        ).map((range) => (
                          <Button
                            key={range}
                            variant={timeRange === range ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setTimeRange(range)}
                            className={`rounded-lg px-3 h-8 ${
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
                  <CardContent>
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={mergedChartData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
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
                              position: 'ins_ideLeft',
                              style: { fill: '#6b7280' }
                            }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#ffffff',
                              border: '1px sol_id #e5e7eb',
                              borderRadius: '0.75rem',
                              padding: '8px 12px'
                            }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload
                                return (
                                  <div className="bg-white border border-[#e5e7eb] rounded-xl p-3 shadow-lg">
                                    <p className="text-sm text-[#111827]">
                                      {data.value} {config.unit}
                                    </p>
                                    <p className="text-xs text-[#6b7280]">
                                      {data.measureAt}
                                    </p>
                                    {data.note && (
                                      <p className="text-xs text-[#6b7280] mt-1 italic">
                                        {data.note}
                                      </p>
                                    )}
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Legend />
                          {/* Actual data line */}
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={trendColor}
                            strokeWidth={3}
                            name={`${config.metricCode} (${config.unit})`}
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
                <div className="gr_id gr_id-cols-2 md:gr_id-cols-4 gap-4">
                  {/* Current Value */}
                  <Card className="rounded-2xl border-[#e5e7eb] bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-[#10b981]" />
                        <p className="text-xs text-[#6b7280]">Current</p>
                      </div>
                      <p className="text-2xl text-[#111827]">
                        {stats.current.toFixed(1)}
                        <span className="text-sm text-[#6b7280] ml-1">
                          {config?.unit}
                        </span>
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
                        <span className="text-sm text-[#6b7280] ml-1">
                          {config?.unit}
                        </span>
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
                      <p
                        className={`text-2xl ${
                          isTrendGood ? 'text-[#10b981]' : 'text-[#ef4444]'
                        }`}
                      >
                        {stats.change > 0 ? '+' : ''}
                        {stats.change.toFixed(1)}
                        <span className="text-sm text-[#6b7280] ml-1">
                          {config?.unit}
                        </span>
                      </p>
                      <p
                        className={`text-xs ${
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
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-[#f59e0b]" />
                        <p className="text-xs text-[#6b7280]">
                          {config?.goalDirection === 'down' ? 'Best' : 'Peak'}
                        </p>
                      </div>
                      <p className="text-2xl text-[#111827]">
                        {(config?.goalDirection === 'down'
                          ? stats.best
                          : stats.worst
                        ).toFixed(1)}
                        <span className="text-sm text-[#6b7280] ml-1">
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
