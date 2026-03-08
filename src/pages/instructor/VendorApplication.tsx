import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Store, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function VendorApplication() {
  useDocumentTitle('Vendor Application - MasashiLearn');
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    contact_email: '',
    website: '',
  });

  // Check if user already has a vendor application
  const { data: existingVendor, isLoading } = useQuery({
    queryKey: ['my-vendor', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('vendors')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string) => {
    setForm(prev => ({ ...prev, name, slug: generateSlug(name) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!form.name.trim() || !form.slug.trim()) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from('vendors').insert({
      owner_id: user.id,
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      contact_email: form.contact_email.trim() || user.email,
      website: form.website.trim() || null,
    });

    setIsSubmitting(false);
    if (error) {
      if (error.code === '23505') {
        toast({ title: 'This URL slug is already taken. Please choose another.', variant: 'destructive' });
      } else {
        toast({ title: 'Failed to submit application', description: error.message, variant: 'destructive' });
      }
      return;
    }

    toast({ title: 'Application submitted!', description: 'An admin will review your application shortly.' });
    navigate('/instructor/dashboard');
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Already applied
  if (existingVendor) {
    const statusConfig = {
      pending: { icon: Clock, label: 'Pending Review', color: 'text-[hsl(var(--warning))]', bg: 'bg-[hsl(var(--warning))]/10' },
      approved: { icon: CheckCircle, label: 'Approved', color: 'text-[hsl(var(--success))]', bg: 'bg-[hsl(var(--success))]/10' },
      rejected: { icon: XCircle, label: 'Rejected', color: 'text-destructive', bg: 'bg-destructive/10' },
      suspended: { icon: XCircle, label: 'Suspended', color: 'text-destructive', bg: 'bg-destructive/10' },
    };
    const status = statusConfig[existingVendor.status as keyof typeof statusConfig] || statusConfig.pending;
    const StatusIcon = status.icon;

    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${status.bg}`}>
              <StatusIcon className={`h-8 w-8 ${status.color}`} />
            </div>
            <h2 className="text-xl font-bold mb-2">Vendor Application: {status.label}</h2>
            <p className="text-muted-foreground mb-4">
              Your school "<strong>{existingVendor.name}</strong>" application is currently {existingVendor.status}.
            </p>
            {existingVendor.status === 'approved' && (
              <Button asChild>
                <a href={`/school/${existingVendor.slug}`}>View Your School Page</a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Become a Vendor</h1>
        <p className="text-muted-foreground">
          Create your own school on MasashiLearn with a unique URL, your branding, and co-branded certificates for your students.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            School Application
          </CardTitle>
          <CardDescription>
            Fill in the details below. An admin will review and approve your application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">School Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Code Academy Pro"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">/school/</span>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="code-academy-pro"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Your school will be accessible at: {window.location.origin}/school/{form.slug || 'your-slug'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Tell us about your school and what you teach..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={form.contact_email}
                onChange={e => setForm(prev => ({ ...prev, contact_email: e.target.value }))}
                placeholder={user?.email || 'your@email.com'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website (optional)</Label>
              <Input
                id="website"
                type="url"
                value={form.website}
                onChange={e => setForm(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://your-website.com"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
