import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/user/ui/card'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts'

interface WeightChartProps {
  data: Array<{ date: string; weight: number }>
}

export function WeightChart({ data }: WeightChartProps) {
  return (
    <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-[#111827]">Weight Progress</CardTitle>
        <p className="text-sm text-[#6b7280]">Last 30 days</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="weightAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              domain={['dataMin - 1', 'dataMax + 1']}
              label={{
                value: 'kg',
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
            <Area
              type="monotone"
              dataKey="weight"
              stroke="#10b981"
              fill="url(#weightAreaGradient)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
