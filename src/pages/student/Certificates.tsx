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

      const { data: progress, error: pErr } = await supabase
        .from('course_progress')
        .select('course_id, lesson_id, is_completed, completed_at')
        .eq('user_id', user.id)
        .eq('is_completed', true);
      if (pErr) throw pErr;

      if (!progress?.length) return [];

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

      // Fetch courses with instructor profile (which now has school branding)
      const { data: courses, error: cErr } = await supabase
        .from('courses')
        .select('id, title, estimated_hours, instructor_id, instructor:profiles!courses_instructor_id_fkey(first_name, last_name, school_name, logo_url, certificate_template, certificate_bg_url, certificate_custom_text, certificate_signature_url), sections(lessons(id))')
        .in('id', courseIds);
      if (cErr) throw cErr;

      // Fetch platform certificate defaults
      const { data: platformRow } = await supabase
        .from('platform_settings')
        .select('value')
        .eq('key', 'certificate_config')
        .single();
      const platformCert = (platformRow?.value as any) ?? {};

      const certs: CertificateData[] = [];
      for (const course of courses ?? []) {
        const totalLessons = ((course as any).sections ?? []).reduce((acc: number, s: any) => acc + (s.lessons?.length || 0), 0);
        const completed = completedByCourse[course.id];
        if (completed && completed.count >= totalLessons && totalLessons > 0) {
          const instructor = (course as any).instructor as any;
          const instructorName = instructor
            ? [instructor.first_name, instructor.last_name].filter(Boolean).join(' ')
            : 'Instructor';
          
          // Use instructor's school branding for certificates
          const hasSchoolTemplate = instructor?.certificate_template && instructor.certificate_template !== 'classic';
          const hasSchoolText = instructor?.certificate_custom_text && typeof instructor.certificate_custom_text === 'object' && Object.keys(instructor.certificate_custom_text as Record<string, unknown>).length > 0;
          
          certs.push({
            id: `CERT-${course.id.slice(0, 8).toUpperCase()}`,
            studentName: user.name,
            courseName: course.title,
            instructorName,
            completionDate: completed.lastDate,
            courseHours: Number(course.estimated_hours),
            vendorName: instructor?.school_name || undefined,
            vendorLogo: instructor?.logo_url || undefined,
            templateId: (hasSchoolTemplate ? instructor.certificate_template : null) || platformCert.template || 'classic',
            customBgUrl: instructor?.certificate_bg_url || platformCert.bg_url || undefined,
            customText: (hasSchoolText ? instructor.certificate_custom_text as CertificateCustomText : null) || (Object.keys(platformCert.custom_text ?? {}).length > 0 ? platformCert.custom_text : undefined),
            signatureUrl: instructor?.certificate_signature_url || platformCert.signature_url || undefined,
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
