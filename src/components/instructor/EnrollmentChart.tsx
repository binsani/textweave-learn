import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const enrollmentData = [
  { month: 'Jan', enrollments: 45, completions: 12 },
  { month: 'Feb', enrollments: 62, completions: 18 },
  { month: 'Mar', enrollments: 78, completions: 24 },
  { month: 'Apr', enrollments: 91, completions: 32 },
  { month: 'May', enrollments: 124, completions: 45 },
  { month: 'Jun', enrollments: 156, completions: 58 },
  { month: 'Jul', enrollments: 189, completions: 72 },
  { month: 'Aug', enrollments: 234, completions: 89 },
  { month: 'Sep', enrollments: 267, completions: 104 },
  { month: 'Oct', enrollments: 312, completions: 128 },
  { month: 'Nov', enrollments: 378, completions: 156 },
  { month: 'Dec', enrollments: 425, completions: 189 },
];

const chartConfig = {
  enrollments: {
    label: 'Enrollments',
    color: 'hsl(var(--primary))',
  },
  completions: {
    label: 'Completions',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function EnrollmentChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-lg">Student Enrollments</CardTitle>
        <p className="text-sm text-muted-foreground">
          Monthly enrollment and completion trends
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart data={enrollmentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs fill-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs fill-muted-foreground"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="enrollments"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#enrollmentGradient)"
            />
            <Area
              type="monotone"
              dataKey="completions"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              fill="url(#completionGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
