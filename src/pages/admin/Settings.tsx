import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CertificateTemplateSelector, type CertificateCustomText } from '@/components/certificate/CertificateTemplateSelector';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User, 
  Shield, 
  Bell, 
  Palette,
  Database,
  Globe,
  Save,
  RefreshCw,
  AlertTriangle,
  Mail,
  Loader2,
  Building2,
  PaintBucket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';

const generalSchema = z.object({
  siteName: z.string().min(2, 'Site name must be at least 2 characters'),
  siteDescription: z.string().max(300, 'Description must be less than 300 characters'),
  supportEmail: z.string().email('Invalid email address'),
  timezone: z.string(),
  language: z.string(),
});

type GeneralFormValues = z.infer<typeof generalSchema>;

export default function AdminSettings() {
  const { toast } = useToast();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [instructorSignup, setInstructorSignup] = useState(true);
  const [emailVerification, setEmailVerification] = useState(true);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [defaultCertTemplate, setDefaultCertTemplate] = useState('classic');
  const [adminCertBgUrl, setAdminCertBgUrl] = useState<string | undefined>(undefined);
  const [adminCertBgUploading, setAdminCertBgUploading] = useState(false);
  const [adminCertText, setAdminCertText] = useState<CertificateCustomText>({});
  const [adminSignatureUrl, setAdminSignatureUrl] = useState<string | undefined>(undefined);
  const [adminSignatureUploading, setAdminSignatureUploading] = useState(false);
  const [certSaving, setCertSaving] = useState(false);
  const [certLoading, setCertLoading] = useState(true);
  const [schoolDialogOpen, setSchoolDialogOpen] = useState(false);
  const [schoolDialogFilter, setSchoolDialogFilter] = useState<'all' | 'defaults' | 'custom'>('all');
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

  // Fetch instructor certificate usage stats
  const isInstructorCustom = (v: { certificate_template: string | null; certificate_bg_url: string | null; certificate_signature_url: string | null; certificate_custom_text: unknown }) => {
    const hasTemplate = v.certificate_template && v.certificate_template !== 'classic';
    const hasBg = !!v.certificate_bg_url;
    const hasSig = !!v.certificate_signature_url;
    const hasText = v.certificate_custom_text && typeof v.certificate_custom_text === 'object' && Object.keys(v.certificate_custom_text as Record<string, unknown>).length > 0;
    return !!(hasTemplate || hasBg || hasSig || hasText);
  };

  const { data: instructorCertData } = useQuery({
    queryKey: ['instructor-cert-stats'],
    queryFn: async () => {
      // Get instructors who have school_name set
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, school_name, school_slug, certificate_template, certificate_bg_url, certificate_custom_text, certificate_signature_url')
        .not('school_name', 'is', null);
      if (error) throw error;
      return (data ?? []).map(v => ({ ...v, name: v.school_name || [v.first_name, v.last_name].filter(Boolean).join(' '), isCustom: isInstructorCustom(v) }));
    },
  });

  const schoolStats = instructorCertData ? {
    total: instructorCertData.length,
    custom: instructorCertData.filter(v => v.isCustom).length,
    usingDefaults: instructorCertData.filter(v => !v.isCustom).length,
  } : undefined;

  const filteredSchools = (instructorCertData ?? []).filter(v => {
    if (schoolDialogFilter === 'defaults') return !v.isCustom;
    if (schoolDialogFilter === 'custom') return v.isCustom;
    return true;
  });

  // Load persisted certificate settings on mount
  useEffect(() => {
    const loadCertConfig = async () => {
      setCertLoading(true);
      const { data, error } = await supabase
        .from('platform_settings' as any)
        .select('value')
        .eq('key', 'certificate_config')
        .single();
      if (!error && data) {
        const config = (data as any).value as Record<string, any>;
        if (config.template) setDefaultCertTemplate(config.template);
        if (config.bg_url) setAdminCertBgUrl(config.bg_url);
        if (config.signature_url) setAdminSignatureUrl(config.signature_url);
        if (config.custom_text && typeof config.custom_text === 'object') {
          setAdminCertText(config.custom_text as CertificateCustomText);
        }
      }
      setCertLoading(false);
    };
    loadCertConfig();
  }, []);

  const saveCertConfig = useCallback(async () => {
    setCertSaving(true);
    const value = {
      template: defaultCertTemplate,
      bg_url: adminCertBgUrl || null,
      signature_url: adminSignatureUrl || null,
      custom_text: adminCertText,
    };
    const { error } = await supabase
      .from('platform_settings' as any)
      .update({ value, updated_at: new Date().toISOString() } as any)
      .eq('key', 'certificate_config');
    setCertSaving(false);
    if (error) {
      toast({ title: 'Failed to save', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Certificate settings saved!' });
    }
  }, [defaultCertTemplate, adminCertBgUrl, adminSignatureUrl, adminCertText, toast]);

  const handleAdminBgUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Please select an image file', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Image must be under 5MB', variant: 'destructive' });
      return;
    }
    setAdminCertBgUploading(true);
    const ext = file.name.split('.').pop() || 'png';
    const path = `platform/certificate-bg.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from('vendor-assets')
      .upload(path, file, { upsert: true, contentType: file.type });
    setAdminCertBgUploading(false);
    if (uploadErr) {
      toast({ title: 'Upload failed', description: uploadErr.message, variant: 'destructive' });
      return;
    }
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/vendor-assets/${path}`;
    setAdminCertBgUrl(publicUrl);
    toast({ title: 'Certificate background uploaded!' });
  };

  const handleAdminBgRemove = () => {
    setAdminCertBgUrl(undefined);
    toast({ title: 'Certificate background removed' });
  };

  const handleAdminSignatureUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Please select an image file', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Image must be under 5MB', variant: 'destructive' });
      return;
    }
    setAdminSignatureUploading(true);
    const ext = file.name.split('.').pop() || 'png';
    const path = `platform/certificate-signature.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from('vendor-assets')
      .upload(path, file, { upsert: true, contentType: file.type });
    setAdminSignatureUploading(false);
    if (uploadErr) {
      toast({ title: 'Upload failed', description: uploadErr.message, variant: 'destructive' });
      return;
    }
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/vendor-assets/${path}`;
    setAdminSignatureUrl(publicUrl);
    toast({ title: 'Signature image uploaded!' });
  };

  const handleAdminSignatureRemove = () => {
    setAdminSignatureUrl(undefined);
    toast({ title: 'Signature image removed' });
  };

  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      siteName: 'MasashiLearn',
      siteDescription: 'A comprehensive learning management system for modern education',
      supportEmail: 'support@masashilearn.com',
      timezone: 'America/Los_Angeles',
      language: 'en',
    },
  });

  const onSubmit = (data: GeneralFormValues) => {
    toast({
      title: 'Settings saved',
      description: 'Platform settings have been updated successfully.',
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Platform Settings</h1>
        <p className="text-muted-foreground">Configure global platform settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>Basic information about your platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Describe your platform..."
                            className="min-h-[80px]"
                          />
                        </FormControl>
                        <FormDescription>
                          Used for SEO and social sharing.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supportEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Support Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormDescription>
                          This email will be used for support inquiries.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                              <SelectItem value="Europe/London">London (GMT)</SelectItem>
                              <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                              <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Language</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                              <SelectItem value="ja">Japanese</SelectItem>
                              <SelectItem value="zh">Chinese</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registration Settings</CardTitle>
              <CardDescription>Control user registration options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Open Registration</Label>
                  <p className="text-sm text-muted-foreground">Allow new users to register</p>
                </div>
                <Switch checked={registrationOpen} onCheckedChange={setRegistrationOpen} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Instructor Signup</Label>
                  <p className="text-sm text-muted-foreground">Allow users to apply as instructors</p>
                </div>
                <Switch checked={instructorSignup} onCheckedChange={setInstructorSignup} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Verification</Label>
                  <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                </div>
                <Switch checked={emailVerification} onCheckedChange={setEmailVerification} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-6">
          {/* School Certificate Usage Stats */}
          {schoolStats && schoolStats.total > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  School Certificate Usage
                </CardTitle>
                <CardDescription>
                  How instructors with schools are using certificate settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <button
                    className="rounded-lg border bg-muted/40 p-3 hover:bg-muted/70 transition-colors cursor-pointer"
                    onClick={() => { setSchoolDialogFilter('all'); setSchoolDialogOpen(true); }}
                  >
                    <p className="text-2xl font-bold text-foreground">{schoolStats.total}</p>
                    <p className="text-xs text-muted-foreground">Total Schools</p>
                  </button>
                  <button
                    className="rounded-lg border bg-muted/40 p-3 hover:bg-muted/70 transition-colors cursor-pointer"
                    onClick={() => { setSchoolDialogFilter('defaults'); setSchoolDialogOpen(true); }}
                  >
                    <p className="text-2xl font-bold text-primary">{schoolStats.usingDefaults}</p>
                    <p className="text-xs text-muted-foreground">Using Defaults</p>
                  </button>
                  <button
                    className="rounded-lg border bg-muted/40 p-3 hover:bg-muted/70 transition-colors cursor-pointer"
                    onClick={() => { setVendorDialogFilter('custom'); setVendorDialogOpen(true); }}
                  >
                    <p className="text-2xl font-bold text-foreground">{schoolStats.custom}</p>
                    <p className="text-xs text-muted-foreground">Custom Design</p>
                  </button>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <PaintBucket className="h-3 w-3" />
                      Platform defaults
                    </span>
                    <span>{schoolStats.total > 0 ? Math.round((schoolStats.usingDefaults / schoolStats.total) * 100) : 0}%</span>
                  </div>
                  <Progress value={schoolStats.total > 0 ? (schoolStats.usingDefaults / schoolStats.total) * 100 : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* School Details Dialog */}
          <Dialog open={vendorDialogOpen} onOpenChange={setVendorDialogOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {vendorDialogFilter === 'defaults' ? 'Schools Using Platform Defaults' : vendorDialogFilter === 'custom' ? 'Schools with Custom Design' : 'All Schools'}
                </DialogTitle>
                <DialogDescription>
                  {filteredSchools.length} school{filteredSchools.length !== 1 ? 's' : ''}
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2 mb-2">
                {(['all', 'defaults', 'custom'] as const).map(f => (
                  <Badge
                    key={f}
                    variant={vendorDialogFilter === f ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setVendorDialogFilter(f)}
                  >
                    {f === 'all' ? 'All' : f === 'defaults' ? 'Defaults' : 'Custom'}
                  </Badge>
                ))}
              </div>
              <ScrollArea className="max-h-[400px]">
                {filteredSchools.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No schools in this category</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>School</TableHead>
                        <TableHead>Template</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSchools.map(v => (
                        <TableRow key={v.id}>
                          <TableCell className="font-medium">{v.name}</TableCell>
                          <TableCell className="text-muted-foreground text-xs capitalize">{v.certificate_template || 'classic'}</TableCell>
                          <TableCell>
                            <Badge variant={v.isCustom ? 'secondary' : 'outline'} className="text-xs">
                              {v.isCustom ? 'Custom' : 'Default'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>
          <CertificateTemplateSelector
            value={defaultCertTemplate}
            onChange={setDefaultCertTemplate}
            customBgUrl={adminCertBgUrl}
            onBgUpload={handleAdminBgUpload}
            onBgRemove={handleAdminBgRemove}
            bgUploading={adminCertBgUploading}
            customText={adminCertText}
            onCustomTextChange={setAdminCertText}
            signatureUrl={adminSignatureUrl}
            onSignatureUpload={handleAdminSignatureUpload}
            onSignatureRemove={handleAdminSignatureRemove}
            signatureUploading={adminSignatureUploading}
          />
          <div className="flex justify-end">
            <Button onClick={saveCertConfig} disabled={certSaving || certLoading}>
              {certSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Template
            </Button>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>Configure authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Force all users to enable 2FA</p>
                </div>
                <Switch checked={twoFactorRequired} onCheckedChange={setTwoFactorRequired} />
              </div>
              <Separator />
              <div>
                <Label>Session Timeout</Label>
                <Select defaultValue="7d">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="24h">24 hours</SelectItem>
                    <SelectItem value="7d">7 days</SelectItem>
                    <SelectItem value="30d">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Maximum Login Attempts</Label>
                <Select defaultValue="5">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 attempts</SelectItem>
                    <SelectItem value="5">5 attempts</SelectItem>
                    <SelectItem value="10">10 attempts</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  Account will be locked after this many failed attempts.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password Policy</CardTitle>
              <CardDescription>Set password requirements for all users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Minimum Password Length</Label>
                <Select defaultValue="8">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 characters</SelectItem>
                    <SelectItem value="8">8 characters</SelectItem>
                    <SelectItem value="10">10 characters</SelectItem>
                    <SelectItem value="12">12 characters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <Label>Require uppercase letter</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <Label>Require lowercase letter</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <Label>Require number</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch />
                  <Label>Require special character</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Configure email delivery settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email Provider</Label>
                <Select defaultValue="sendgrid">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                    <SelectItem value="ses">Amazon SES</SelectItem>
                    <SelectItem value="smtp">Custom SMTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="from-email">From Email</Label>
                <Input id="from-email" defaultValue="noreply@masashilearn.com" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="from-name">From Name</Label>
                <Input id="from-name" defaultValue="MasashiLearn" className="mt-2" />
              </div>
              <Separator />
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Send Test Email
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
              <CardDescription>Temporarily disable access to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Only admins can access the platform during maintenance
                  </p>
                </div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage platform data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Export All Data</p>
                  <p className="text-sm text-muted-foreground">Download a backup of all platform data</p>
                </div>
                <Button variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Clear Cache</p>
                  <p className="text-sm text-muted-foreground">Clear all cached data</p>
                </div>
                <Button variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear Cache
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Reset Platform</p>
                  <p className="text-sm text-muted-foreground">
                    Delete all data and reset to factory defaults
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Reset Platform</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all courses, users, and data from the platform.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground">
                        Yes, reset everything
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
