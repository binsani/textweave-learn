import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Ticket, Plus, Copy, Trash2, Users, Calendar, BookOpen, Mail, Key } from 'lucide-react';
import { format } from 'date-fns';

const DOMAIN = 'masashilearn.com.ng';

function generateCode(length = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function buildEmail(firstName: string, lastName: string): string {
  const f = firstName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const l = lastName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!f) return '';
  return l ? `${f}.${l}@${DOMAIN}` : `${f}@${DOMAIN}`;
}

function buildPassword(code: string): string {
  return `Masashi_${code}!`;
}

export default function PurchaseCodes() {
  useDocumentTitle('Purchase Codes - Admin');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [newCode, setNewCode] = useState(generateCode());
  const [maxUses, setMaxUses] = useState(1);
  const [expiresAt, setExpiresAt] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const generatedEmail = useMemo(() => buildEmail(firstName, lastName), [firstName, lastName]);
  const generatedPassword = useMemo(() => buildPassword(newCode), [newCode]);

  // Fetch purchase codes
  const { data: codes = [], isLoading } = useQuery({
    queryKey: ['purchase-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_codes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch redemptions
  const { data: redemptions = [] } = useQuery({
    queryKey: ['purchase-code-redemptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_code_redemptions')
        .select('*')
        .order('redeemed_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch published courses for selection
  const { data: courses = [] } = useQuery({
    queryKey: ['admin-courses-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .eq('status', 'published')
        .order('title');
      if (error) throw error;
      return data;
    },
  });

  // Create code mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('purchase_codes').insert({
        code: newCode,
        course_ids: selectedCourses,
        max_uses: maxUses,
        expires_at: expiresAt || null,
        notes,
        created_by: user.id,
        student_first_name: firstName.trim(),
        student_last_name: lastName.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-codes'] });
      toast({ title: 'Purchase code created', description: `Code: ${newCode}` });
      setCreateOpen(false);
      setNewCode(generateCode());
      setMaxUses(1);
      setExpiresAt('');
      setNotes('');
      setSelectedCourses([]);
      setFirstName('');
      setLastName('');
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  // Toggle active mutation
  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('purchase_codes')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-codes'] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('purchase_codes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-codes'] });
      toast({ title: 'Purchase code deleted' });
    },
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: `${label} copied to clipboard.` });
  };

  const toggleCourse = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId) ? prev.filter((c) => c !== courseId) : [...prev, courseId]
    );
  };

  const getRedemptionCount = (codeId: string) =>
    redemptions.filter((r) => r.code_id === codeId).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Purchase Codes</h1>
          <p className="text-muted-foreground">Generate codes for students paying via direct transfer</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Generate Code</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Generate Purchase Code</DialogTitle>
              <DialogDescription>Create a new purchase code for direct-payment students</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {/* Student name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Student First Name <span className="text-destructive">*</span></Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label>Student Last Name <span className="text-destructive">*</span></Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
                </div>
              </div>

              {/* Code */}
              <div className="space-y-2">
                <Label>Code</Label>
                <div className="flex gap-2">
                  <Input value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())} className="font-mono tracking-widest" />
                  <Button variant="outline" size="icon" onClick={() => setNewCode(generateCode())} title="Regenerate">
                    <Ticket className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Generated credentials preview */}
              {firstName.trim() && lastName.trim() && (
                <div className="rounded-md border border-primary/20 bg-primary/5 p-3 space-y-2">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">Auto-Generated Credentials</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm font-mono truncate">{generatedEmail}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => copyToClipboard(generatedEmail, 'Email')}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Key className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm font-mono">{generatedPassword}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => copyToClipboard(generatedPassword, 'Password')}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Share these credentials with the student so they can log in.</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Uses</Label>
                  <Input type="number" min={1} value={maxUses} onChange={(e) => setMaxUses(Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Expires At (optional)</Label>
                  <Input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Payment ref..." />
              </div>

              <div className="space-y-2">
                <Label>Grant Access To Courses</Label>
                {courses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No published courses available.</p>
                ) : (
                  <>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium hover:bg-muted/50 rounded px-2 py-1.5 border-b border-border pb-2">
                      <input
                        type="checkbox"
                        checked={courses.length > 0 && selectedCourses.length === courses.length}
                        ref={(el) => { if (el) el.indeterminate = selectedCourses.length > 0 && selectedCourses.length < courses.length; }}
                        onChange={() => {
                          if (selectedCourses.length === courses.length) {
                            setSelectedCourses([]);
                          } else {
                            setSelectedCourses(courses.map((c) => c.id));
                          }
                        }}
                        className="rounded border-input"
                      />
                      Select All ({courses.length} courses)
                    </label>
                    <ScrollArea className="h-40 border rounded-md p-2">
                      <div className="space-y-2">
                        {courses.map((course) => (
                          <label key={course.id} className="flex items-center gap-2 cursor-pointer text-sm hover:bg-muted/50 rounded px-2 py-1.5">
                            <input
                              type="checkbox"
                              checked={selectedCourses.includes(course.id)}
                              onChange={() => toggleCourse(course.id)}
                              className="rounded border-input"
                            />
                            {course.title}
                          </label>
                        ))}
                      </div>
                    </ScrollArea>
                  </>
                )}
              </div>

              <Button
                className="w-full"
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending || !newCode.trim() || !firstName.trim() || !lastName.trim()}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Purchase Code'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Ticket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{codes.length}</p>
                <p className="text-sm text-muted-foreground">Total Codes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Users className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{redemptions.length}</p>
                <p className="text-sm text-muted-foreground">Redemptions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <Calendar className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{codes.filter((c) => !c.is_active).length}</p>
                <p className="text-sm text-muted-foreground">Deactivated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Codes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Purchase Codes</CardTitle>
          <CardDescription>Manage purchase codes for direct-payment students</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : codes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No purchase codes yet. Generate one to get started.</p>
          ) : (
            <ScrollArea className="max-h-[500px]">
              <Table>
                <TableHeader>
                   <TableRow>
                     <TableHead>Student</TableHead>
                     <TableHead>Code</TableHead>
                     <TableHead>Email</TableHead>
                     <TableHead>Password</TableHead>
                     <TableHead>Courses</TableHead>
                     <TableHead>Uses</TableHead>
                     <TableHead>Expires</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead className="w-[100px]">Actions</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                  {codes.map((pc: any) => {
                    const email = buildEmail(pc.student_first_name || '', pc.student_last_name || '');
                    const password = buildPassword(pc.code);
                    return (
                      <TableRow key={pc.id}>
                        <TableCell>
                          <span className="text-sm font-medium">
                            {pc.student_first_name || ''} {pc.student_last_name || ''}
                          </span>
                        </TableCell>
                        <TableCell>
                          <button onClick={() => copyToClipboard(pc.code, 'Code')} className="font-mono text-sm tracking-wider hover:text-primary transition-colors flex items-center gap-1.5" title="Click to copy">
                            {pc.code}
                            <Copy className="h-3 w-3 opacity-50" />
                          </button>
                        </TableCell>
                        <TableCell>
                          {email ? (
                            <button onClick={() => copyToClipboard(email, 'Email')} className="font-mono text-xs hover:text-primary transition-colors flex items-center gap-1.5" title="Click to copy email">
                              {email}
                              <Copy className="h-3 w-3 opacity-50" />
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{(pc.course_ids as string[])?.length || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{getRedemptionCount(pc.id)} / {pc.max_uses}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {pc.expires_at ? format(new Date(pc.expires_at), 'MMM d, yyyy') : '—'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={pc.is_active}
                            onCheckedChange={(checked) => toggleMutation.mutate({ id: pc.id, is_active: checked })}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              if (confirm('Delete this purchase code?')) deleteMutation.mutate(pc.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
