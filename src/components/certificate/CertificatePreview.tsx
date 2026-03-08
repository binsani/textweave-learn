import { useRef } from 'react';
import { Award, Download, Printer, X, Linkedin, Twitter } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface CertificateData {
  id: string;
  studentName: string;
  courseName: string;
  instructorName: string;
  completionDate: string;
  courseHours: number;
  vendorName?: string;
  vendorLogo?: string;
}

interface CertificatePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate: CertificateData | null;
}

export function CertificatePreview({ open, onOpenChange, certificate }: CertificatePreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!certificate) return null;

  // Generate verification URL
  const verificationUrl = `${window.location.origin}/verify?id=${encodeURIComponent(certificate.id)}`;

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${certificate.courseName}</title>
          <style>
            @page { size: landscape; margin: 0; }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Georgia', serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: white;
            }
            .certificate {
              width: 100%;
              max-width: 1000px;
              aspect-ratio: 1.414;
              padding: 60px;
              border: 8px double #1a365d;
              margin: 20px;
              background: linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%);
              position: relative;
            }
            .certificate::before {
              content: '';
              position: absolute;
              inset: 15px;
              border: 2px solid #c4b896;
              pointer-events: none;
            }
            .header { text-align: center; margin-bottom: 30px; }
            .icon { width: 60px; height: 60px; margin: 0 auto 15px; color: #b8860b; }
            .title { font-size: 42px; color: #1a365d; letter-spacing: 4px; font-weight: normal; }
            .subtitle { font-size: 16px; color: #666; margin-top: 10px; letter-spacing: 2px; }
            .content { text-align: center; margin: 40px 0; }
            .presented { font-size: 14px; color: #666; margin-bottom: 10px; }
            .student-name { font-size: 36px; color: #1a365d; font-style: italic; margin: 20px 0; }
            .completion { font-size: 16px; color: #444; line-height: 1.8; max-width: 600px; margin: 0 auto; }
            .course-name { font-weight: bold; color: #1a365d; }
            .footer { display: flex; justify-content: space-between; margin-top: 50px; padding: 0 60px; }
            .signature { text-align: center; }
            .signature-line { width: 200px; border-top: 1px solid #333; margin-bottom: 8px; }
            .signature-name { font-size: 14px; color: #333; }
            .signature-title { font-size: 12px; color: #666; }
            .cert-id { position: absolute; bottom: 25px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #999; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownload = () => {
    handlePrint();
  };

  const handleShareLinkedIn = () => {
    const text = `I just earned a certificate for completing "${certificate.courseName}"! 🎓`;
    const url = window.location.href;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
    toast({
      title: "Sharing to LinkedIn",
      description: "A new window has opened for sharing.",
    });
  };

  const handleShareTwitter = () => {
    const text = `I just earned a certificate for completing "${certificate.courseName}"! 🎓 #learning #certificate`;
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    toast({
      title: "Sharing to Twitter",
      description: "A new window has opened for sharing.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Certificate of Completion
          </DialogTitle>
        </DialogHeader>

        {/* Certificate Preview */}
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden">
          <div
            ref={printRef}
            className="certificate p-8 md:p-12 border-8 border-double border-primary/30 relative"
            style={{ aspectRatio: '1.414' }}
          >
            {/* Inner border */}
            <div className="absolute inset-4 border-2 border-primary/30 pointer-events-none" />
            
            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-between text-center">
              {/* Header */}
              <div className="header">
                {certificate.vendorLogo ? (
                  <img
                    src={certificate.vendorLogo}
                    alt={certificate.vendorName}
                    className="h-12 w-12 md:h-16 md:w-16 mx-auto rounded-lg object-cover mb-3"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <Award className="icon h-12 w-12 md:h-16 md:w-16 mx-auto text-primary mb-3" />
                )}
                {certificate.vendorName && (
                  <p className="text-xs md:text-sm font-semibold text-primary mb-1">
                    {certificate.vendorName}
                  </p>
                )}
                <h1 className="title text-2xl md:text-4xl text-primary font-serif tracking-widest">
                  CERTIFICATE
                </h1>
                <p className="subtitle text-xs md:text-sm text-muted-foreground tracking-wider mt-2">
                  OF COMPLETION
                </p>
              </div>

              {/* Main content */}
              <div className="content flex-1 flex flex-col justify-center">
                <p className="presented text-xs md:text-sm text-muted-foreground mb-2">
                  This is to certify that
                </p>
                <p className="student-name text-xl md:text-3xl text-primary italic font-serif my-4">
                  {certificate.studentName}
                </p>
                <p className="completion text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
                  has successfully completed the course<br />
                  <span className="course-name font-semibold text-primary">
                    "{certificate.courseName}"
                  </span>
                  <br />
                  comprising {certificate.courseHours} hours of instruction
                </p>
              </div>

              {/* Footer with signatures */}
              <div className="footer w-full flex justify-between px-4 md:px-12">
                <div className="signature text-center">
                  <div className="signature-line w-32 md:w-48 border-t border-foreground/50 mb-2" />
                  <p className="signature-name text-xs md:text-sm font-medium">
                    {certificate.instructorName}
                  </p>
                  <p className="signature-title text-xs text-muted-foreground">
                    Course Instructor
                  </p>
                </div>
                <div className="signature text-center">
                  <div className="signature-line w-32 md:w-48 border-t border-foreground/50 mb-2" />
                  <p className="signature-name text-xs md:text-sm font-medium">
                    {format(new Date(certificate.completionDate), 'MMMM d, yyyy')}
                  </p>
                  <p className="signature-title text-xs text-muted-foreground">
                    Date of Completion
                  </p>
                </div>
              </div>

              {/* Certificate ID, QR Code, and Co-branding */}
              <div className="absolute bottom-2 left-0 right-0 flex items-end justify-between px-4">
                <div>
                  <p className="cert-id text-xs text-muted-foreground">
                    Certificate ID: {certificate.id}
                  </p>
                  {certificate.vendorName && (
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                      Powered by MasashiLearn
                    </p>
                  )}
                </div>
                <div className="bg-white p-1 rounded shadow-sm">
                  <QRCodeSVG 
                    value={verificationUrl} 
                    size={48} 
                    level="M"
                    includeMargin={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-between gap-2 pt-4">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleShareLinkedIn}>
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share on LinkedIn</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleShareTwitter}>
                    <Twitter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share on Twitter</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
