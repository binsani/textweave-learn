import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Store, CheckCircle, XCircle, Clock, ExternalLink, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function AdminVendors() {
  useDocumentTitle('Vendor Management - MasashiLearn');
  const queryClient = useQueryClient();

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['admin-vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*, owner:profiles!vendors_owner_id_fkey(first_name, last_name, email)')
        .order('applied_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: Record<string, unknown> = { status };
      if (status === 'approved') updates.approved_at = new Date().toISOString();
      const { error } = await supabase.from('vendors').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
      toast({ title: `Vendor ${status}` });
    },
    onError: (err: Error) => {
      toast({ title: 'Failed to update vendor', description: err.message, variant: 'destructive' });
    },
  });

  const statusBadge = (status: string) => {
    const map: Record<string, { variant: 'default' | 'outline' | 'destructive' | 'secondary'; label: string }> = {
      pending: { variant: 'outline', label: 'Pending' },
      approved: { variant: 'default', label: 'Approved' },
      rejected: { variant: 'destructive', label: 'Rejected' },
      suspended: { variant: 'destructive', label: 'Suspended' },
    };
    const cfg = map[status] || map.pending;
    return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-4">
        <Skeleton className="h-10 w-48" />
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    );
  }

  const pending = vendors.filter(v => v.status === 'pending');
  const others = vendors.filter(v => v.status !== 'pending');

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Vendor Management</h1>
          <p className="text-muted-foreground">Review and manage vendor applications</p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {pending.length} pending
        </Badge>
      </div>

      {/* Pending applications */}
      {pending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Applications
            </CardTitle>
            <CardDescription>{pending.length} application(s) awaiting review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pending.map(vendor => {
              const owner = vendor.owner as any;
              const ownerName = owner ? [owner.first_name, owner.last_name].filter(Boolean).join(' ') || owner.email : 'Unknown';
              return (
                <div key={vendor.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Store className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold">{vendor.name}</h3>
                        {statusBadge(vendor.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">/school/{vendor.slug}</p>
                      {vendor.description && (
                        <p className="text-sm mt-2">{vendor.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Owner: {ownerName}</span>
                        <span>Applied: {format(new Date(vendor.applied_at), 'MMM d, yyyy')}</span>
                        {vendor.website && (
                          <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                            <Globe className="h-3 w-3" /> Website
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        onClick={() => updateStatus.mutate({ id: vendor.id, status: 'rejected' })}
                        disabled={updateStatus.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateStatus.mutate({ id: vendor.id, status: 'approved' })}
                        disabled={updateStatus.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* All vendors */}
      <Card>
        <CardHeader>
          <CardTitle>All Vendors</CardTitle>
          <CardDescription>{vendors.length} total vendors</CardDescription>
        </CardHeader>
        <CardContent>
          {vendors.length === 0 ? (
            <div className="text-center py-8">
              <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No vendor applications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {vendors.map(vendor => {
                const owner = vendor.owner as any;
                const ownerName = owner ? [owner.first_name, owner.last_name].filter(Boolean).join(' ') || owner.email : 'Unknown';
                return (
                  <div key={vendor.id} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Store className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{vendor.name}</p>
                        {statusBadge(vendor.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Owner: {ownerName} · /school/{vendor.slug}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {vendor.status === 'approved' && (
                        <>
                          <Button size="sm" variant="ghost" asChild>
                            <a href={`/school/${vendor.slug}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive"
                            onClick={() => updateStatus.mutate({ id: vendor.id, status: 'suspended' })}
                          >
                            Suspend
                          </Button>
                        </>
                      )}
                      {vendor.status === 'suspended' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus.mutate({ id: vendor.id, status: 'approved' })}
                        >
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
