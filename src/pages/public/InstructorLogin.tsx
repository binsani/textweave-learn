import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function InstructorLogin() {
  useDocumentTitle('Instructor Login - Masashi LMS');
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(formData.email, formData.password);

    if (success) {
      const role = useAuthStore.getState().user?.role;
      if (role !== 'instructor') {
        useAuthStore.getState().logout();
        toast({
          title: 'Access denied',
          description: 'This login is for instructors only. Please use the appropriate login page.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      toast({ title: 'Welcome back!', description: 'Your teaching dashboard is ready.' });
      navigate('/instructor/dashboard');
    } else {
      toast({ title: 'Login failed', description: 'Invalid email or password.', variant: 'destructive' });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-muted/40 to-background">
      <Card className="w-full max-w-md shadow-elegant border-accent/20">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 ring-2 ring-accent/20">
            <BookOpen className="h-7 w-7 text-accent" />
          </div>
          <CardTitle className="font-serif text-2xl">Instructor Portal</CardTitle>
          <CardDescription>Sign in to manage your courses</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instructor-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="instructor-email" type="email" placeholder="instructor@masashi.edu" className="pl-10" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="instructor-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In as Instructor'}
            </Button>
          </form>

          <div className="mt-6 rounded-lg bg-muted/50 p-3 text-center text-xs text-muted-foreground">
            <p className="font-medium mb-1">Demo Credentials</p>
            <p>Email: <span className="font-mono text-foreground">instructor@masashi.edu</span></p>
            <p>Password: <span className="font-mono text-foreground">any password</span></p>
          </div>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Not an instructor?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Go to main login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
