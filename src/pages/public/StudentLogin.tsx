import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { supabase } from '@/integrations/supabase/client';

export default function StudentLogin() {
  useDocumentTitle('Student Login - MasashiLearn');
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  // Purchase code state
  const [purchaseCode, setPurchaseCode] = useState('');
  const [isPcLoading, setIsPcLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast({ title: 'Welcome back!', description: 'Ready to continue learning.' });
      setTimeout(() => {
        const role = useAuthStore.getState().user?.role;
        if (role !== 'student') {
          toast({ title: 'Access denied', description: 'This login is for students only.', variant: 'destructive' });
          useAuthStore.getState().logout();
        } else {
          navigate('/student/dashboard');
        }
      }, 200);
    } else {
      toast({ title: 'Login failed', description: result.error || 'Invalid email or password.', variant: 'destructive' });
    }

    setIsLoading(false);
  };

  const handlePurchaseCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseCode.trim()) return;

    setIsPcLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('redeem-purchase-code', {
        body: {
          code: purchaseCode.trim().toUpperCase(),
          first_name: pcFirstName.trim(),
          last_name: pcLastName.trim(),
        },
      });

      if (error) {
        toast({ title: 'Error', description: 'Failed to validate purchase code.', variant: 'destructive' });
        setIsPcLoading(false);
        return;
      }

      if (data?.error) {
        toast({ title: 'Invalid Code', description: data.error, variant: 'destructive' });
        setIsPcLoading(false);
        return;
      }

      if (data?.session) {
        // Set the session directly
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

        toast({
          title: data.returning ? 'Welcome back!' : 'Account created!',
          description: data.returning
            ? 'You have been signed in with your purchase code.'
            : 'Your account has been created and courses have been enrolled.',
        });

        // Small delay for auth state to propagate
        setTimeout(() => {
          navigate('/student/dashboard');
        }, 500);
      }
    } catch (err) {
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    }

    setIsPcLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-muted/40 to-background">
      <Card className="w-full max-w-md shadow-elegant border-primary/20">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-2 ring-primary/20">
            <GraduationCap className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="font-serif text-2xl">Student Portal</CardTitle>
          <CardDescription>Sign in to continue your learning journey</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                Email
              </TabsTrigger>
              <TabsTrigger value="purchase-code" className="gap-1.5">
                <Ticket className="h-3.5 w-3.5" />
                Purchase Code
              </TabsTrigger>
            </TabsList>

            {/* Email Login */}
            <TabsContent value="email" className="mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="student-email" type="email" placeholder="student@example.com" className="pl-10" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="student-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In as Student'}
                </Button>
              </form>
            </TabsContent>

            {/* Purchase Code Login */}
            <TabsContent value="purchase-code" className="mt-4">
              <form onSubmit={handlePurchaseCodeSubmit} className="space-y-4">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
                  <p>Enter the purchase code provided to you after your payment was confirmed.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase-code">Purchase Code</Label>
                  <div className="relative">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="purchase-code"
                      type="text"
                      placeholder="e.g. ABCD1234"
                      className="pl-10 font-mono tracking-widest uppercase"
                      value={purchaseCode}
                      onChange={(e) => setPurchaseCode(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isPcLoading}>
                  {isPcLoading ? 'Verifying...' : 'Access with Purchase Code'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center space-y-2">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
            <p className="text-sm text-muted-foreground">
              Not a student?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">Go to main login</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
