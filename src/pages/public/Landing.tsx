import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePublishedCourses, dbCourseToCardProps } from '@/hooks/useCourses';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMemo } from 'react';

const features = [
  'Text-first learning optimized for deep understanding',
  'Learn at your own pace with structured lessons',
  'Track your progress with detailed analytics',
  'Take notes and bookmark important sections',
  'Quizzes to test your comprehension',
  'Certificates upon course completion',
];

export default function Landing() {
  useDocumentTitle('MasashiLearn - Text-First Learning Platform');
  const { data: dbCourses, isLoading } = usePublishedCourses();
  const featuredCourses = useMemo(
    () => (dbCourses ?? []).slice(0, 3).map(dbCourseToCardProps),
    [dbCourses]
  );

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 animate-fade-up">
              <BookOpen className="h-3 w-3 mr-1" />
              Text-First Learning Platform
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight animate-fade-up stagger-1">
              Master New Skills Through{' '}
              <span className="text-primary relative">
                Thoughtful Reading
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" preserveAspectRatio="none">
                  <path d="M0,5 Q50,0 100,5 T200,5" fill="none" stroke="hsl(var(--accent))" strokeWidth="3" className="animate-fade-in" style={{ animationDelay: '0.8s' }} />
                </svg>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-up stagger-2">
              MasashiLearn offers a distraction-free learning experience designed for deep comprehension. 
              No videos, no fluff — just expertly crafted lessons that help you truly understand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up stagger-3">
              <Button size="lg" asChild className="text-base hover-lift group">
                <Link to="/courses">
                  Explore Courses
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base hover-lift">
                <Link to="/signup">Start Learning Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-xl bg-primary/10 hover-scale transition-transform">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="font-serif text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Why MasashiLearn?</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                Learning Through Reading Works Better
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Research shows that reading promotes deeper cognitive engagement than passive video watching. 
                Our text-first approach ensures you actively process and retain information.
              </p>
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 p-8 flex items-center justify-center animate-float">
                <div className="bg-card rounded-xl shadow-xl border border-border/50 p-6 w-full max-w-sm hover-glow transition-all">
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse-soft" />
                    <div className="h-3 bg-muted rounded w-full animate-pulse-soft" style={{ animationDelay: '0.1s' }} />
                    <div className="h-3 bg-muted rounded w-5/6 animate-pulse-soft" style={{ animationDelay: '0.2s' }} />
                    <div className="h-3 bg-muted rounded w-4/5 animate-pulse-soft" style={{ animationDelay: '0.3s' }} />
                    <div className="h-8 bg-primary/20 rounded mt-6" />
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Featured Courses</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Start Your Learning Journey
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our carefully curated courses taught by industry experts
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : featuredCourses.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-40" />
                <p>Courses coming soon! Check back later.</p>
              </div>
            ) : (
              featuredCourses.map((course, index) => (
                <Link to={`/courses/${course.id}`} key={course.id}>
                  <Card className="group card-hover overflow-hidden animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                      {course.thumbnail && (
                        <img src={course.thumbnail} alt={course.title} loading="lazy" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      )}
                      <Badge className="absolute top-3 left-3">{course.category}</Badge>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{course.totalLessons} lessons</span>
                        <span className="font-semibold text-primary">{course.price === 0 ? 'Free' : `$${course.price}`}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>

          <div className="text-center mt-10">
            <Button variant="outline" size="lg" asChild className="hover-lift group">
              <Link to="/courses">
                View All Courses
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of learners who have discovered the power of text-based education. 
              Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/instructors">Become an Instructor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
