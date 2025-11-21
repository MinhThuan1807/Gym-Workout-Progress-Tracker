import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/user/ui/card'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts'

interface WorkoutFrequencyChartProps {
  data: Array<{ week: string; sessions: number }>
}

export function WorkoutFrequencyChart({ data }: WorkoutFrequencyChartProps) {
  return (
    <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-[#111827]">Workout Frequency</CardTitle>
        <p className="text-sm text-[#6b7280]">Last 4 weeks</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="week"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{
                value: 'sessions',
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
            />
            <Bar dataKey="sessions" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
