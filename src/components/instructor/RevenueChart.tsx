import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function RevenueChart() {
  const { user } = useAuthStore();

  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ['revenue-chart', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: courses } = await supabase
        .from('courses')
        .select('id, price')
        .eq('instructor_id', user.id);
      if (!courses?.length) return [];

      const courseIds = courses.map(c => c.id);
      const priceMap: Record<string, number> = {};
      for (const c of courses) priceMap[c.id] = c.price;

      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id, enrolled_at')
        .in('course_id', courseIds)
        .order('enrolled_at', { ascending: true });

      const monthlyMap: Record<string, number> = {};
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

      for (const e of enrollments ?? []) {
        const d = new Date(e.enrolled_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthlyMap[key] = (monthlyMap[key] || 0) + (priceMap[e.course_id] || 0) * 0.7;
      }

      const sortedKeys = Object.keys(monthlyMap).sort().slice(-12);
      return sortedKeys.map(k => ({
        month: monthNames[parseInt(k.split('-')[1]) - 1],
        revenue: Math.round(monthlyMap[k]),
      }));
    },
    enabled: !!user,
  });

  const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-serif text-lg">Revenue Overview</CardTitle>
            <p className="text-sm text-muted-foreground">Monthly earnings</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            No revenue data yet
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} className="text-xs fill-muted-foreground" />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `$${v}`} className="text-xs fill-muted-foreground" />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => <span>Revenue: ${Number(value).toLocaleString()}</span>}
                  />
                }
              />
              <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
