import { useState } from 'react';
import { User, Bell, Shield, Palette, Camera, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/ui/image-upload';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function StudentSettings() {
  const { user, updateUser } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [notifications, setNotifications] = useState({
    courseUpdates: true,
    newCourses: false,
    promotions: false,
  });

  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(user?.avatar || '');

  // Purchase code user detection & credentials setup
  const isPurchaseCodeUser = user?.email?.endsWith('@platform.masashilearn.local') ?? false;
  const [credentialsForm, setCredentialsForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSettingCredentials, setIsSettingCredentials] = useState(false);

  const handleSaveProfile = () => {
    updateUser({ name: formData.name });
    toast({
      title: 'Profile updated',
      description: 'Your changes have been saved.',
    });
  };

  const handleSaveAvatar = () => {
    if (tempAvatar) {
      updateUser({ avatar: tempAvatar });
      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been changed.',
      });
    }
    setAvatarDialogOpen(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-lg">
                  {user?.name ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={() => setAvatarDialogOpen(true)}>
                <Camera className="h-4 w-4 mr-2" />
                Change Avatar
              </Button>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              {isPurchaseCodeUser ? (
                <button
                  type="button"
                  onClick={() => document.getElementById('setup-email-login')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="w-full rounded-md border border-primary/20 bg-primary/5 p-3 text-left hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  <p className="text-sm font-medium text-foreground">No email linked yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You're using a purchase code account. Tap here to set up a real email and password — you'll still be able to log in with your code too!
                  </p>
                </button>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact support to change your email address
                  </p>
                </div>
              )}
            </div>

            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how MasashiLearn looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Use dark theme for better reading at night
                </p>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Choose what updates you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Course Updates</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when enrolled courses are updated
                </p>
              </div>
              <Switch
                checked={notifications.courseUpdates}
                onCheckedChange={(checked) => setNotifications({ ...notifications, courseUpdates: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Courses</p>
                <p className="text-sm text-muted-foreground">
                  Discover new courses in your areas of interest
                </p>
              </div>
              <Switch
                checked={notifications.newCourses}
                onCheckedChange={(checked) => setNotifications({ ...notifications, newCourses: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Promotions</p>
                <p className="text-sm text-muted-foreground">
                  Receive special offers and discounts
                </p>
              </div>
              <Switch
                checked={notifications.promotions}
                onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Set Up Credentials (purchase code users only) */}
        {isPurchaseCodeUser && (
          <Card id="setup-email-login" className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Set Up Email Login
              </CardTitle>
              <CardDescription>
                You signed in with a purchase code. Set an email and password so you can also log in with email in the future. Your purchase code will still work.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (credentialsForm.password !== credentialsForm.confirmPassword) {
                    toast({ title: 'Passwords do not match', variant: 'destructive' });
                    return;
                  }
                  if (credentialsForm.password.length < 6) {
                    toast({ title: 'Password must be at least 6 characters', variant: 'destructive' });
                    return;
                  }
                  setIsSettingCredentials(true);
                  const { error } = await supabase.auth.updateUser({
                    email: credentialsForm.email,
                    password: credentialsForm.password,
                  });
                  setIsSettingCredentials(false);
                  if (error) {
                    toast({ title: 'Error', description: error.message, variant: 'destructive' });
                  } else {
                    toast({
                      title: 'Credentials set!',
                      description: 'Check your new email for a confirmation link. Once confirmed, you can log in with email & password.',
                    });
                  }
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="new-email">New Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={credentialsForm.email}
                      onChange={(e) => setCredentialsForm({ ...credentialsForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      className="pl-10 pr-10"
                      value={credentialsForm.password}
                      onChange={(e) => setCredentialsForm({ ...credentialsForm, password: e.target.value })}
                      required
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Re-enter password"
                      className="pl-10"
                      value={credentialsForm.confirmPassword}
                      onChange={(e) => setCredentialsForm({ ...credentialsForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isSettingCredentials}>
                  {isSettingCredentials ? 'Saving...' : 'Set Up Email Login'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">
                  Update your password regularly for security
                </p>
              </div>
              <Button variant="outline">Update</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-destructive">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="destructive">Delete</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Avatar Upload Dialog */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <ImageUpload
              value={tempAvatar}
              onChange={setTempAvatar}
              aspect={1}
              placeholder="Upload profile picture"
              className="w-48 h-48 mx-auto"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAvatarDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAvatar}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
