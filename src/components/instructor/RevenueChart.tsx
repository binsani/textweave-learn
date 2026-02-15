import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 1200, refunds: 45 },
  { month: 'Feb', revenue: 1850, refunds: 62 },
  { month: 'Mar', revenue: 2100, refunds: 38 },
  { month: 'Apr', revenue: 2450, refunds: 55 },
  { month: 'May', revenue: 3200, refunds: 78 },
  { month: 'Jun', revenue: 2890, refunds: 42 },
  { month: 'Jul', revenue: 3450, refunds: 91 },
  { month: 'Aug', revenue: 4100, refunds: 65 },
  { month: 'Sep', revenue: 3780, refunds: 58 },
  { month: 'Oct', revenue: 4520, refunds: 72 },
  { month: 'Nov', revenue: 5200, refunds: 95 },
  { month: 'Dec', revenue: 6100, refunds: 110 },
];

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
  refunds: {
    label: 'Refunds',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

export function RevenueChart() {
  const totalRevenue = revenueData.reduce((acc, d) => acc + d.revenue, 0);
  const totalRefunds = revenueData.reduce((acc, d) => acc + d.refunds, 0);
  const netRevenue = totalRevenue - totalRefunds;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-serif text-lg">Revenue Overview</CardTitle>
            <p className="text-sm text-muted-foreground">
              Monthly earnings and refunds
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              ${netRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Net Revenue (YTD)</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
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
              tickFormatter={(value) => `$${value}`}
              className="text-xs fill-muted-foreground"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <span>
                      {name === 'revenue' ? 'Revenue' : 'Refunds'}: ${Number(value).toLocaleString()}
                    </span>
                  )}
                />
              }
            />
            <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="refunds" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
