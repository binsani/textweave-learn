import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const chartConfig = {
  enrollments: {
    label: 'Enrollments',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function EnrollmentChart() {
  const { user } = useAuthStore();

  const { data: chartData = [] } = useQuery({
    queryKey: ['enrollment-chart', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: courses } = await supabase
        .from('courses')
        .select('id')
        .eq('instructor_id', user.id);
      if (!courses?.length) return [];

      const courseIds = courses.map(c => c.id);
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('enrolled_at')
        .in('course_id', courseIds)
        .order('enrolled_at', { ascending: true });

      const monthlyMap: Record<string, number> = {};
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

      for (const e of enrollments ?? []) {
        const d = new Date(e.enrolled_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthlyMap[key] = (monthlyMap[key] || 0) + 1;
      }

      const sortedKeys = Object.keys(monthlyMap).sort().slice(-12);
      return sortedKeys.map(k => ({
        month: monthNames[parseInt(k.split('-')[1]) - 1],
        enrollments: monthlyMap[k],
      }));
    },
    enabled: !!user,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-lg">Student Enrollments</CardTitle>
        <p className="text-sm text-muted-foreground">
          Monthly enrollment trends
        </p>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            No enrollment data yet
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} className="text-xs fill-muted-foreground" />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs fill-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="enrollments" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#enrollmentGradient)" />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
