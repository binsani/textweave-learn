import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CertificateCard, CertificatePreview } from '@/components/certificate';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import type { CertificateCustomText } from '@/components/certificate/CertificateTemplateSelector';

interface CertificateData {
  id: string;
  studentName: string;
  courseName: string;
  instructorName: string;
  completionDate: string;
  courseHours: number;
  vendorName?: string;
  vendorLogo?: string;
  templateId?: string;
  customBgUrl?: string;
  customText?: CertificateCustomText;
  signatureUrl?: string;
}

export default function StudentCertificates() {
  const { user } = useAuthStore();
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ['certificates', user?.id],
    queryFn: async (): Promise<CertificateData[]> => {
      if (!user) return [];

      // Get all courses where user has completed every lesson
      const { data: progress, error: pErr } = await supabase
        .from('course_progress')
        .select('course_id, lesson_id, is_completed, completed_at')
        .eq('user_id', user.id)
        .eq('is_completed', true);
      if (pErr) throw pErr;

      if (!progress?.length) return [];

      // Group completed lessons by course
      const completedByCourse: Record<string, { count: number; lastDate: string }> = {};
      for (const row of progress) {
        if (!completedByCourse[row.course_id]) {
          completedByCourse[row.course_id] = { count: 0, lastDate: row.completed_at || '' };
        }
        completedByCourse[row.course_id].count++;
        if ((row.completed_at || '') > completedByCourse[row.course_id].lastDate) {
          completedByCourse[row.course_id].lastDate = row.completed_at || '';
        }
      }

      const courseIds = Object.keys(completedByCourse);
      if (!courseIds.length) return [];

      // Fetch courses with their sections/lessons counts and instructor
      const { data: courses, error: cErr } = await supabase
        .from('courses')
        .select('id, title, estimated_hours, vendor_id, instructor:profiles!courses_instructor_id_fkey(first_name, last_name), sections(lessons(id))')
        .in('id', courseIds);
      if (cErr) throw cErr;

      // Fetch vendor info for courses that have vendor_id
      const vendorIds = [...new Set((courses ?? []).map(c => c.vendor_id).filter(Boolean))];
      let vendorMap: Record<string, { name: string; logo_url: string | null; certificate_template: string; certificate_bg_url: string | null; certificate_custom_text: any }> = {};
      if (vendorIds.length > 0) {
        const { data: vendorsData } = await supabase
          .from('vendors')
          .select('id, name, logo_url, certificate_template, certificate_bg_url, certificate_custom_text')
          .in('id', vendorIds);
        for (const v of vendorsData ?? []) {
          vendorMap[v.id] = { name: v.name, logo_url: v.logo_url, certificate_template: v.certificate_template, certificate_bg_url: v.certificate_bg_url, certificate_custom_text: v.certificate_custom_text };
        }
      }

      const certs: CertificateData[] = [];
      for (const course of courses ?? []) {
        const totalLessons = (course.sections ?? []).reduce((acc: number, s: any) => acc + (s.lessons?.length || 0), 0);
        const completed = completedByCourse[course.id];
        if (completed && completed.count >= totalLessons && totalLessons > 0) {
          const instructor = course.instructor as any;
          const instructorName = instructor
            ? [instructor.first_name, instructor.last_name].filter(Boolean).join(' ')
            : 'Instructor';
          const vendor = course.vendor_id ? vendorMap[course.vendor_id] : null;
          certs.push({
            id: `CERT-${course.id.slice(0, 8).toUpperCase()}`,
            studentName: user.name,
            courseName: course.title,
            instructorName,
            completionDate: completed.lastDate,
            courseHours: Number(course.estimated_hours),
            vendorName: vendor?.name,
            vendorLogo: vendor?.logo_url || undefined,
            templateId: vendor?.certificate_template || 'classic',
            customBgUrl: vendor?.certificate_bg_url || undefined,
            customText: (vendor?.certificate_custom_text as CertificateCustomText) || undefined,
            signatureUrl: (vendor as any)?.certificate_signature_url || undefined,
          });
        }
      }
      return certs;
    },
    enabled: !!user,
  });

  const handleView = (cert: CertificateData) => {
    setSelectedCertificate(cert);
    setPreviewOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-4">
        <Skeleton className="h-10 w-48" />
        {[1, 2].map(i => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Certificates</h1>
        <p className="text-muted-foreground">
          View and download your earned certificates
        </p>
      </div>

      {certificates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">No certificates yet</h3>
            <p className="text-muted-foreground">
              Complete a course to earn your first certificate
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Certificates
              </CardTitle>
              <CardDescription>
                {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} earned
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {certificates.map((cert) => (
                <CertificateCard
                  key={cert.id}
                  id={cert.id}
                  courseName={cert.courseName}
                  completionDate={cert.completionDate}
                  onView={() => handleView(cert)}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      <CertificatePreview
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        certificate={selectedCertificate}
      />
    </div>
  );
}
