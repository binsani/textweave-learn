import { useSearchParams } from 'react-router-dom';
import { Award, CheckCircle, XCircle, Calendar, Clock, User, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

// Mock certificate database for verification
const certificateDatabase: Record<string, {
  id: string;
  studentName: string;
  courseName: string;
  instructorName: string;
  completionDate: string;
  courseHours: number;
  isValid: boolean;
}> = {
  'CERT-2024-001': {
    id: 'CERT-2024-001',
    studentName: 'Alex Thompson',
    courseName: 'Python Programming Fundamentals',
    instructorName: 'Dr. Sarah Mitchell',
    completionDate: '2024-06-15T10:00:00Z',
    courseHours: 15,
    isValid: true,
  },
  'CERT-2024-002': {
    id: 'CERT-2024-002',
    studentName: 'Alex Thompson',
    courseName: 'Data Science with Python',
    instructorName: 'Prof. James Anderson',
    completionDate: '2024-08-20T10:00:00Z',
    courseHours: 24,
    isValid: true,
  },
  'CERT-2024-003': {
    id: 'CERT-2024-003',
    studentName: 'Alex Thompson',
    courseName: 'Machine Learning Essentials',
    instructorName: 'Dr. Emily Chen',
    completionDate: '2024-10-05T10:00:00Z',
    courseHours: 30,
    isValid: true,
  },
};

export default function CertificateVerify() {
  const [searchParams] = useSearchParams();
  const certId = searchParams.get('id');

  const certificate = certId ? certificateDatabase[certId] : null;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Award className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Certificate Verification
          </h1>
          <p className="text-muted-foreground">
            Verify the authenticity of a certificate issued by Masashi LMS
          </p>
        </div>

        {!certId ? (
          <Card>
            <CardContent className="py-12 text-center">
              <XCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">No Certificate ID Provided</h3>
              <p className="text-muted-foreground">
                Please scan a valid QR code from a certificate to verify its authenticity.
              </p>
            </CardContent>
          </Card>
        ) : certificate ? (
          <Card className="border-2 border-green-500/20">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-500/10 p-3">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
              </div>
              <Badge variant="outline" className="mx-auto mb-2 border-green-500 text-green-600">
                Verified Certificate
              </Badge>
              <CardTitle className="text-xl">This certificate is authentic</CardTitle>
              <CardDescription>
                Certificate ID: {certificate.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <User className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Issued to</p>
                    <p className="font-medium">{certificate.studentName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Course Completed</p>
                    <p className="font-medium">{certificate.courseName}</p>
                    <p className="text-sm text-muted-foreground">
                      Instructor: {certificate.instructorName}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Completed on</p>
                      <p className="font-medium">
                        {format(new Date(certificate.completionDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Course Duration</p>
                      <p className="font-medium">{certificate.courseHours} hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-destructive/20">
            <CardContent className="py-12 text-center">
              <div className="rounded-full bg-destructive/10 p-3 w-fit mx-auto mb-4">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
              <h3 className="font-medium text-lg mb-2">Certificate Not Found</h3>
              <p className="text-muted-foreground mb-2">
                No certificate found with ID: <code className="bg-muted px-2 py-1 rounded">{certId}</code>
              </p>
              <p className="text-sm text-muted-foreground">
                This certificate may be invalid or has been revoked.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
