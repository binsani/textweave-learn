import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const portals = [
  {
    icon: GraduationCap,
    title: 'Student Portal',
    description: 'Access your courses, track progress, and earn certificates.',
    to: '/student/login',
    color: 'bg-primary/10 text-primary ring-primary/20',
    buttonLabel: 'Sign in as Student',
  },
  {
    icon: BookOpen,
    title: 'Instructor Portal',
    description: 'Manage your courses, view analytics, and engage with students.',
    to: '/instructor/login',
    color: 'bg-accent/10 text-accent-foreground ring-accent/20',
    buttonLabel: 'Sign in as Instructor',
  },
];

export default function Login() {
  useDocumentTitle('Sign In - MasashiLearn');

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-muted/30">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-2xl font-bold">MasashiLearn</span>
          </Link>
          <h1 className="font-serif text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-1">Choose your portal to sign in</p>
        </div>

        {/* Portal Cards */}
        <div className="grid gap-4">
          {portals.map((portal) => (
            <Link key={portal.to} to={portal.to}>
              <Card className="hover:shadow-lg transition-all hover:border-primary/30 cursor-pointer group">
                <CardContent className="flex items-center gap-4 py-6">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ring-2 ${portal.color}`}>
                    <portal.icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {portal.title}
                    </CardTitle>
                    <CardDescription className="mt-1">{portal.description}</CardDescription>
                  </div>
                  <svg className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
