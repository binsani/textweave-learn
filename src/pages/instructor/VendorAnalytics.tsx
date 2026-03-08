import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  DollarSign,
  BookOpen,
  TrendingUp,
  Star,
  Store,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PIE_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(200, 70%, 50%)',
  'hsl(280, 70%, 50%)',
  'hsl(340, 70%, 50%)',
  'hsl(50, 70%, 50%)',
];

export default function VendorAnalytics() {
  useDocumentTitle('School Analytics - MasashiLearn');
  const { user } = useAuthStore();

  const { data: vendors, isLoading: vendorsLoading } = useQuery({
    queryKey: ['vendor-analytics-vendors', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('vendors')
        .select('id, name, slug, status, logo_url, primary_color')
        .eq('owner_id', user.id)
        .eq('status', 'approved');
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const vendorIds = vendors?.map((v) => v.id) ?? [];

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['vendor-analytics-data', vendorIds],
    queryFn: async () => {
      if (!vendorIds.length) return null;

      // Fetch courses for all vendors
      const { data: courses, error } = await supabase
        .from('courses')
        .select('id, title, vendor_id, enrolled_count, price, rating, review_count, status')
        .in('vendor_id', vendorIds);

      if (error) throw error;
      const courseList = courses ?? [];
      const courseIds = courseList.map((c) => c.id);

      // Fetch enrollments for monthly breakdown
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id, enrolled_at')
        .in('course_id', courseIds.length > 0 ? courseIds : ['none']);

      // Per-vendor aggregation
      const vendorMap: Record<
        string,
        {
          totalStudents: number;
          totalRevenue: number;
          totalCourses: number;
          publishedCourses: number;
          avgRating: number;
          courses: typeof courseList;
        }
      > = {};

      for (const v of vendors!) {
        const vCourses = courseList.filter((c) => c.vendor_id === v.id);
        const published = vCourses.filter((c) => c.status === 'published');
        const students = vCourses.reduce((s, c) => s + c.enrolled_count, 0);
        const revenue = vCourses.reduce((s, c) => s + c.price * c.enrolled_count * 0.7, 0);
        const rated = published.filter((c) => Number(c.rating) > 0);
        const avg = rated.length > 0 ? rated.reduce((s, c) => s + Number(c.rating), 0) / rated.length : 0;

        vendorMap[v.id] = {
          totalStudents: students,
          totalRevenue: Math.round(revenue),
          totalCourses: vCourses.length,
          publishedCourses: published.length,
          avgRating: avg,
          courses: vCourses,
        };
      }

      // Global stats
      const globalStudents = Object.values(vendorMap).reduce((s, v) => s + v.totalStudents, 0);
      const globalRevenue = Object.values(vendorMap).reduce((s, v) => s + v.totalRevenue, 0);
      const globalCourses = courseList.length;

      // Monthly enrollment data
      const monthlyMap: Record<string, number> = {};
      for (const e of enrollments ?? []) {
        const d = new Date(e.enrolled_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthlyMap[key] = (monthlyMap[key] || 0) + 1;
      }
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const sortedMonths = Object.keys(monthlyMap).sort().slice(-6);
      const monthlyChart = sortedMonths.map((k) => ({
        month: monthNames[parseInt(k.split('-')[1]) - 1],
        enrollments: monthlyMap[k],
      }));

      // Revenue per vendor for pie chart
      const revenuePie = vendors!
        .map((v) => ({
          name: v.name,
          value: vendorMap[v.id]?.totalRevenue ?? 0,
        }))
        .filter((v) => v.value > 0);

      // Top courses
      const topCourses = [...courseList]
        .sort((a, b) => b.enrolled_count - a.enrolled_count)
        .slice(0, 5);

      return {
        globalStudents,
        globalRevenue,
        globalCourses,
        vendorMap,
        monthlyChart,
        revenuePie,
        topCourses,
      };
    },
    enabled: vendorIds.length > 0,
  });

  const isLoading = vendorsLoading || analyticsLoading;

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (!vendors?.length) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center py-16">
          <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">No Schools Yet</h2>
          <p className="text-muted-foreground mb-6">
            Apply to create a school to see analytics here.
          </p>
          <Button asChild>
            <Link to="/instructor/vendor">Apply Now</Link>
          </Button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Students',
      value: (analytics?.globalStudents ?? 0).toLocaleString(),
      icon: Users,
    },
    {
      title: 'Total Revenue',
      value: `$${(analytics?.globalRevenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
    },
    {
      title: 'Total Courses',
      value: (analytics?.globalCourses ?? 0).toString(),
      icon: BookOpen,
    },
    {
      title: 'Schools',
      value: vendors.length.toString(),
      icon: Store,
    },
  ];

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">School Analytics</h1>
        <p className="text-muted-foreground">
          Track performance across all your schools
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Enrollments</CardTitle>
            <CardDescription>Across all schools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {analytics?.monthlyChart && analytics.monthlyChart.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.monthlyChart}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar
                      dataKey="enrollments"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                      name="Enrollments"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No enrollment data yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by School */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by School</CardTitle>
            <CardDescription>Distribution across your schools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {analytics?.revenuePie && analytics.revenuePie.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.revenuePie}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: $${value}`}
                    >
                      {analytics.revenuePie.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `$${value.toLocaleString()}`}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No revenue data yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Per-School Breakdown */}
      <div className="grid gap-6 mb-6">
        {vendors.map((vendor) => {
          const vData = analytics?.vendorMap[vendor.id];
          return (
            <Card key={vendor.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {vendor.logo_url ? (
                      <img
                        src={vendor.logo_url}
                        alt={vendor.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center text-primary-foreground font-bold"
                        style={{ backgroundColor: vendor.primary_color || 'hsl(var(--primary))' }}
                      >
                        {vendor.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{vendor.name}</CardTitle>
                      <CardDescription>/school/{vendor.slug}</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/school/${vendor.slug}`}>View Storefront</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">Students</p>
                    <p className="text-xl font-bold text-foreground">
                      {(vData?.totalStudents ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-xl font-bold text-foreground">
                      ${(vData?.totalRevenue ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">Courses</p>
                    <p className="text-xl font-bold text-foreground">
                      {vData?.publishedCourses ?? 0} / {vData?.totalCourses ?? 0}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                    <p className="text-xl font-bold text-foreground flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      {vData?.avgRating ? vData.avgRating.toFixed(1) : '—'}
                    </p>
                  </div>
                </div>

                {/* Top courses in this vendor */}
                {vData?.courses && vData.courses.filter((c) => c.status === 'published').length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Top Courses</p>
                    {vData.courses
                      .filter((c) => c.status === 'published')
                      .sort((a, b) => b.enrolled_count - a.enrolled_count)
                      .slice(0, 3)
                      .map((course) => (
                        <div
                          key={course.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm text-foreground">{course.title}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{course.enrolled_count} students</span>
                            <span>${Math.round(course.price * course.enrolled_count * 0.7)}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
