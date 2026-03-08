import { useState, useRef, useCallback } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Store, Upload, Trash2, Loader2, ExternalLink, Palette,
  Globe, Mail, Image as ImageIcon, LinkIcon,
} from 'lucide-react';
import { CertificateTemplateSelector } from '@/components/certificate/CertificateTemplateSelector';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

function getPublicUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/vendor-assets/${path}`;
}

export default function VendorSettings() {
  useDocumentTitle('School Settings - MasashiLearn');
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const { data: vendor, isLoading } = useQuery({
    queryKey: ['my-vendor-settings', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('owner_id', user.id)
        .eq('status', 'approved')
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const [form, setForm] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<'logo' | 'banner' | 'certificate_bg' | null>(null);
  const certBgInputRef = useRef<HTMLInputElement>(null);

  // Initialize form from vendor data
  const initForm = useCallback(() => {
    if (!vendor) return {};
    return {
      name: vendor.name || '',
      description: vendor.description || '',
      contact_email: vendor.contact_email || '',
      website: vendor.website || '',
      about_html: vendor.about_html || '',
      primary_color: vendor.primary_color || '#6366f1',
      accent_color: vendor.accent_color || '#8b5cf6',
      certificate_template: vendor.certificate_template || 'classic',
    };
  }, [vendor]);

  // Lazy-init form when vendor loads
  const currentForm = Object.keys(form).length > 0 ? form : initForm();

  const updateField = (key: string, value: string) => {
    setForm(prev => ({ ...initForm(), ...prev, [key]: value }));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!vendor) throw new Error('No vendor');
      const { error } = await supabase
        .from('vendors')
        .update({
          name: currentForm.name,
          description: currentForm.description,
          contact_email: currentForm.contact_email,
          website: currentForm.website || null,
          about_html: currentForm.about_html,
          primary_color: currentForm.primary_color,
          accent_color: currentForm.accent_color,
          certificate_template: currentForm.certificate_template,
        })
        .eq('id', vendor.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-vendor-settings'] });
      toast({ title: 'Settings saved!' });
    },
    onError: (err: Error) => {
      toast({ title: 'Failed to save', description: err.message, variant: 'destructive' });
    },
  });

  const handleImageUpload = async (type: 'logo' | 'banner' | 'certificate_bg', file: File) => {
    if (!vendor) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Please select an image file', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Image must be under 5MB', variant: 'destructive' });
      return;
    }

    setUploading(type);
    const ext = file.name.split('.').pop() || 'png';
    const path = `${vendor.id}/${type}.${ext}`;

    // Upload to storage
    const { error: uploadErr } = await supabase.storage
      .from('vendor-assets')
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadErr) {
      setUploading(null);
      toast({ title: 'Upload failed', description: uploadErr.message, variant: 'destructive' });
      return;
    }

    const publicUrl = getPublicUrl(path);
    const column = type === 'logo' ? 'logo_url' : type === 'banner' ? 'banner_url' : 'certificate_bg_url';

    const { error: updateErr } = await supabase
      .from('vendors')
      .update({ [column]: publicUrl })
      .eq('id', vendor.id);

    setUploading(null);
    if (updateErr) {
      toast({ title: 'Failed to update', description: updateErr.message, variant: 'destructive' });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['my-vendor-settings'] });
    const label = type === 'logo' ? 'Logo' : type === 'banner' ? 'Banner' : 'Certificate background';
    toast({ title: `${label} updated!` });
  };

  const handleRemoveImage = async (type: 'logo' | 'banner' | 'certificate_bg') => {
    if (!vendor) return;
    const column = type === 'logo' ? 'logo_url' : type === 'banner' ? 'banner_url' : 'certificate_bg_url';
    const { error } = await supabase
      .from('vendors')
      .update({ [column]: null })
      .eq('id', vendor.id);

    if (error) {
      toast({ title: 'Failed to remove', description: error.message, variant: 'destructive' });
      return;
    }
    queryClient.invalidateQueries({ queryKey: ['my-vendor-settings'] });
    const label = type === 'logo' ? 'Logo' : type === 'banner' ? 'Banner' : 'Certificate background';
    toast({ title: `${label} removed` });
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">No Approved School</h3>
            <p className="text-muted-foreground mb-4">
              You need an approved vendor application to access school settings.
            </p>
            <Button asChild>
              <Link to="/instructor/vendor">Apply to Become a Vendor</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">School Settings</h1>
          <p className="text-muted-foreground">
            Customize your school's branding and appearance
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={`/school/${vendor.slug}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            View School
          </a>
        </Button>
      </div>

      {/* Logo & Banner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Branding Images
          </CardTitle>
          <CardDescription>Upload your school logo and banner image</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo */}
          <div className="space-y-3">
            <Label>Logo</Label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted/30 shrink-0">
                {vendor.logo_url ? (
                  <img
                    src={vendor.logo_url}
                    alt="Logo"
                    className="h-full w-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = ''; }}
                  />
                ) : (
                  <Store className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploading === 'logo'}
                  >
                    {uploading === 'logo' ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Upload Logo
                  </Button>
                  {vendor.logo_url && (
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveImage('logo')}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: 200×200px, PNG or JPG, max 5MB
                </p>
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload('logo', file);
                  e.target.value = '';
                }}
              />
            </div>
          </div>

          <Separator />

          {/* Banner */}
          <div className="space-y-3">
            <Label>Banner Image</Label>
            <div
              className="relative h-40 rounded-xl border-2 border-dashed border-border overflow-hidden bg-muted/30 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => bannerInputRef.current?.click()}
            >
              {vendor.banner_url ? (
                <>
                  <img
                    src={vendor.banner_url}
                    alt="Banner"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = ''; }}
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">Click to replace</p>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  {uploading === 'banner' ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  )}
                  <p className="text-sm text-muted-foreground">Click to upload banner</p>
                  <p className="text-xs text-muted-foreground mt-1">Recommended: 1920×480px</p>
                </div>
              )}
            </div>
            {vendor.banner_url && (
              <Button variant="ghost" size="sm" onClick={() => handleRemoveImage('banner')}>
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Banner
              </Button>
            )}
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload('banner', file);
                e.target.value = '';
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Brand Colors
          </CardTitle>
          <CardDescription>
            Customize the colors of your school page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="primary_color"
                  value={currentForm.primary_color || '#6366f1'}
                  onChange={e => updateField('primary_color', e.target.value)}
                  className="h-10 w-14 rounded-lg border border-border cursor-pointer"
                />
                <Input
                  value={currentForm.primary_color || '#6366f1'}
                  onChange={e => updateField('primary_color', e.target.value)}
                  placeholder="#6366f1"
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent_color">Accent Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="accent_color"
                  value={currentForm.accent_color || '#8b5cf6'}
                  onChange={e => updateField('accent_color', e.target.value)}
                  className="h-10 w-14 rounded-lg border border-border cursor-pointer"
                />
                <Input
                  value={currentForm.accent_color || '#8b5cf6'}
                  onChange={e => updateField('accent_color', e.target.value)}
                  placeholder="#8b5cf6"
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6">
            <Label className="mb-2 block">Preview</Label>
            <div
              className="h-24 rounded-xl flex items-center justify-center text-white font-serif text-lg font-bold"
              style={{
                background: `linear-gradient(135deg, ${currentForm.primary_color || '#6366f1'}, ${currentForm.accent_color || '#8b5cf6'})`,
              }}
            >
              {currentForm.name || vendor.name}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* School Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            School Information
          </CardTitle>
          <CardDescription>Update your school's public profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">School Name</Label>
            <Input
              id="name"
              value={currentForm.name || ''}
              onChange={e => updateField('name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              value={currentForm.description || ''}
              onChange={e => updateField('description', e.target.value)}
              rows={3}
              placeholder="A brief description of your school..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about_html">About Section</Label>
            <Textarea
              id="about_html"
              value={currentForm.about_html || ''}
              onChange={e => updateField('about_html', e.target.value)}
              rows={5}
              placeholder="Tell students more about your school, teaching philosophy, and what they can expect..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email">
                <Mail className="h-3.5 w-3.5 inline mr-1" />
                Contact Email
              </Label>
              <Input
                id="contact_email"
                type="email"
                value={currentForm.contact_email || ''}
                onChange={e => updateField('contact_email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">
                <Globe className="h-3.5 w-3.5 inline mr-1" />
                Website
              </Label>
              <Input
                id="website"
                type="url"
                value={currentForm.website || ''}
                onChange={e => updateField('website', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificate Template */}
      <CertificateTemplateSelector
        value={currentForm.certificate_template || 'classic'}
        onChange={(id) => updateField('certificate_template', id)}
        customBgUrl={vendor.certificate_bg_url || undefined}
        onBgUpload={(file) => handleImageUpload('certificate_bg', file)}
        onBgRemove={() => handleRemoveImage('certificate_bg')}
        bgUploading={uploading === 'certificate_bg'}
      />

      {/* Save */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setForm({})}>
          Reset
        </Button>
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
