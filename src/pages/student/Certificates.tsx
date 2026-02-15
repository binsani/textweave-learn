import { useState } from 'react';
import { Award, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CertificateCard, CertificatePreview } from '@/components/certificate';
import { useAuthStore } from '@/stores/authStore';

// Mock certificates data
const mockCertificates = [
  {
    id: 'CERT-2024-001',
    studentName: 'Alex Thompson',
    courseName: 'Python Programming Fundamentals',
    instructorName: 'Dr. Sarah Mitchell',
    completionDate: '2024-06-15T10:00:00Z',
    courseHours: 15,
  },
  {
    id: 'CERT-2024-002',
    studentName: 'Alex Thompson',
    courseName: 'Data Science with Python',
    instructorName: 'Prof. James Anderson',
    completionDate: '2024-08-20T10:00:00Z',
    courseHours: 24,
  },
];

export default function StudentCertificates() {
  const { user } = useAuthStore();
  const [selectedCertificate, setSelectedCertificate] = useState<typeof mockCertificates[0] | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Use user's name in certificates
  const certificates = mockCertificates.map(cert => ({
    ...cert,
    studentName: user?.name || cert.studentName,
  }));

  const handleView = (cert: typeof mockCertificates[0]) => {
    setSelectedCertificate(cert);
    setPreviewOpen(true);
  };

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
