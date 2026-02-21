import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function AdminLogin() {
  useDocumentTitle('Admin Login - Masashi LMS');
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      setTimeout(() => {
        const role = useAuthStore.getState().user?.role;
        if (role !== 'admin') {
          toast({ title: 'Access denied', description: 'This login is for administrators only.', variant: 'destructive' });
          useAuthStore.getState().logout();
        } else {
          toast({ title: 'Welcome, Admin!', description: 'You have successfully logged in.' });
          navigate('/admin/dashboard');
        }
      }, 200);
    } else {
      toast({ title: 'Login failed', description: result.error || 'Invalid email or password.', variant: 'destructive' });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-muted/40 to-background">
      <Card className="w-full max-w-md shadow-elegant border-primary/20">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-2 ring-primary/20">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="font-serif text-2xl">Admin Portal</CardTitle>
          <CardDescription>Sign in with your administrator credentials</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="admin-email" type="email" placeholder="admin@example.com" className="pl-10" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="admin-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In as Admin'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
            <p className="text-sm text-muted-foreground">
              Not an admin?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">Go to regular login</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
