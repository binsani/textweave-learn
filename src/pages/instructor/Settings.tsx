import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User, 
  Mail, 
  Bell, 
  Lock, 
  CreditCard, 
  Globe, 
  Palette,
  Save,
  Camera,
  Link2,
  UserPlus,
  Star,
  CheckCircle2,
  Award,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
import { useNotificationStore, type NotificationType } from '@/stores/notificationStore';

const notificationTypes: { type: NotificationType; label: string; description: string; icon: typeof Bell }[] = [
  { type: 'enrollment', label: 'New Enrollments', description: 'When a student enrolls in your course', icon: UserPlus },
  { type: 'review', label: 'New Reviews', description: 'When a student leaves a review', icon: Star },
  { type: 'completion', label: 'Course Completions', description: 'When a student completes your course', icon: CheckCircle2 },
  { type: 'certificate', label: 'Certificates Earned', description: 'When a student earns a certificate', icon: Award },
  { type: 'purchase', label: 'New Purchases', description: 'When a student purchases your course', icon: ShoppingCart },
];

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function InstructorSettings() {
  const { toast } = useToast();
  const { preferences, updatePreferences, setInAppPref, setEmailPref } = useNotificationStore();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'John Instructor',
      email: 'john@example.com',
      bio: 'Experienced web developer and educator with 10+ years in the industry. Passionate about teaching and helping others succeed.',
      website: 'https://johndoe.com',
      twitter: 'johndoe',
      linkedin: 'johndoe',
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    toast({
      title: 'Settings saved',
      description: 'Your profile has been updated successfully.',
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payout">Payout</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your public profile information</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Avatar */}
              <div className="flex items-center gap-6 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">JI</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Camera className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Tell students about yourself..."
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormDescription>
                          This will be displayed on your instructor profile.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Social Links</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input {...field} className="pl-10" placeholder="https://" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Twitter</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                                <Input {...field} className="pl-8" placeholder="username" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
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
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          {/* In-App Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>In-App Notifications</CardTitle>
              <CardDescription>Choose which notifications appear in your notification bell</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationTypes.map(({ type, label, description, icon: Icon }) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <Label>{label}</Label>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.inApp[type]}
                    onCheckedChange={(checked) => setInAppPref(type, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure when you receive email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Master toggle for all email notifications</p>
                </div>
                <Switch
                  checked={preferences.emailMaster}
                  onCheckedChange={(checked) => updatePreferences({ emailMaster: checked })}
                />
              </div>
              <Separator />
              {notificationTypes.map(({ type, label, description, icon: Icon }) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <Label>{label}</Label>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.email[type] && preferences.emailMaster}
                    disabled={!preferences.emailMaster}
                    onCheckedChange={(checked) => setEmailPref(type, checked)}
                  />
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Tips, promotions, and platform updates</p>
                </div>
                <Switch
                  checked={preferences.marketingEmails}
                  onCheckedChange={(checked) => updatePreferences({ marketingEmails: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payout Tab */}
        <TabsContent value="payout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payout Settings</CardTitle>
              <CardDescription>Configure how you receive your earnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Payout Method</Label>
                <Select defaultValue="stripe">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Stripe Connected</p>
                    <p className="text-sm text-muted-foreground">Account ending in 4242</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Link2 className="mr-2 h-4 w-4" />
                  Manage Stripe Account
                </Button>
              </div>

              <Separator />

              <div>
                <Label>Minimum Payout</Label>
                <Select defaultValue="50">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">$50</SelectItem>
                    <SelectItem value="100">$100</SelectItem>
                    <SelectItem value="250">$250</SelectItem>
                    <SelectItem value="500">$500</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  Payouts are processed monthly when your balance exceeds this amount.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current">Current Password</Label>
                <Input id="current" type="password" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="new">New Password</Label>
                <Input id="new" type="password" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="confirm">Confirm New Password</Label>
                <Input id="confirm" type="password" className="mt-2" />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Protect your account with an authenticator app
                  </p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
