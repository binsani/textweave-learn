import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, Eye, EyeOff, User, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';

const roles = [
  {
    value: 'student' as const,
    icon: GraduationCap,
    title: 'Learn',
    description: 'Sign up as a student to access courses and earn certificates.',
    color: 'bg-primary/10 text-primary ring-primary/20',
  },
  {
    value: 'instructor' as const,
    icon: BookOpen,
    title: 'Teach',
    description: 'Sign up as an instructor to create courses and reach students.',
    color: 'bg-accent/10 text-accent-foreground ring-accent/20',
  },
];

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuthStore();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'instructor' | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setIsLoading(true);

    const result = await signup(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName,
      selectedRole
    );

    if (result.success) {
      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account before signing in.',
      });
      navigate('/login');
    } else {
      toast({
        title: 'Signup failed',
        description: result.error || 'Could not create account.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

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
          <h1 className="font-serif text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground mt-1">
            {selectedRole ? 'Fill in your details to get started' : 'Choose how you want to use MasashiLearn'}
          </p>
        </div>

        {!selectedRole ? (
          /* Role Selection Portal Cards */
          <div className="grid gap-4">
            {roles.map((role) => (
              <button key={role.value} onClick={() => setSelectedRole(role.value)} className="w-full text-left">
                <Card className="hover:shadow-lg transition-all hover:border-primary/30 cursor-pointer group">
                  <CardContent className="flex items-center gap-4 py-6">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ring-2 ${role.color}`}>
                      <role.icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {role.title}
                      </CardTitle>
                      <CardDescription className="mt-1">{role.description}</CardDescription>
                    </div>
                    <svg className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        ) : (
          /* Signup Form */
          <Card className="shadow-elegant">
            <CardContent className="pt-6">
              <button
                onClick={() => setSelectedRole(null)}
                className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to role selection
              </button>

              <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-muted/50">
                {(() => {
                  const role = roles.find(r => r.value === selectedRole)!;
                  return (
                    <>
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-2 ${role.color}`}>
                        <role.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Signing up to {role.title}</p>
                        <p className="text-xs text-muted-foreground">As {selectedRole === 'student' ? 'a student' : 'an instructor'}</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className="pl-10"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                By signing up, you agree to our{' '}
                <Link to="/terms" className="text-primary hover:underline">Terms</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
