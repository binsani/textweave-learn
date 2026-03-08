import { useRef } from 'react';
import { Award, Download, Printer, X, Linkedin, Twitter } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { getTemplate } from './certificateTemplates';
import { type CertificateCustomText, DEFAULT_CERT_TEXT } from './CertificateTemplateSelector';

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

interface CertificatePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate: CertificateData | null;
}

export function CertificatePreview({ open, onOpenChange, certificate }: CertificatePreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!certificate) return null;

  const template = getTemplate(certificate.templateId || 'classic');
  const t = { ...DEFAULT_CERT_TEXT, ...certificate.customText };
  const verificationUrl = `${window.location.origin}/verify?id=${encodeURIComponent(certificate.id)}`;
  const isDark = ['midnight', 'tech'].includes(template.id);

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
              font-family: ${template.titleFont};
              display: flex; align-items: center; justify-content: center;
              min-height: 100vh; background: white;
            }
            .certificate {
              width: 100%; max-width: 1000px; aspect-ratio: 1.414;
              padding: 60px; border: ${template.borderStyle};
              margin: 20px; background: ${template.bgGradient}; position: relative;
            }
            .certificate::before {
              content: ''; position: absolute; inset: 15px;
              border: 2px solid ${template.innerBorderColor}; pointer-events: none;
            }
            .header { text-align: center; margin-bottom: 30px; }
            .icon { width: 60px; height: 60px; margin: 0 auto 15px; color: ${template.accentColor}; }
            .title { font-size: 42px; color: ${template.titleColor}; letter-spacing: 4px; font-weight: normal; font-family: ${template.titleFont}; }
            .subtitle { font-size: 16px; color: ${template.textColor}; margin-top: 10px; letter-spacing: 2px; }
            .content { text-align: center; margin: 40px 0; }
            .presented { font-size: 14px; color: ${template.textColor}; margin-bottom: 10px; }
            .student-name { font-size: 36px; color: ${template.titleColor}; font-style: italic; margin: 20px 0; font-family: ${template.titleFont}; }
            .completion { font-size: 16px; color: ${template.textColor}; line-height: 1.8; max-width: 600px; margin: 0 auto; }
            .course-name { font-weight: bold; color: ${template.titleColor}; }
            .footer { display: flex; justify-content: space-between; margin-top: 50px; padding: 0 60px; }
            .signature { text-align: center; }
            .signature-line { width: 200px; border-top: 1px solid ${template.accentColor}; margin-bottom: 8px; }
            .signature-name { font-size: 14px; color: ${template.titleColor}; }
            .signature-title { font-size: 12px; color: ${template.textColor}; }
            .cert-id { position: absolute; bottom: 25px; left: 50%; transform: translateX(-50%); font-size: 10px; color: ${template.textColor}; }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
  };

  const handleDownload = () => handlePrint();

  const handleShareLinkedIn = () => {
    const text = `I just earned a certificate for completing "${certificate.courseName}"! 🎓`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`, '_blank', 'width=600,height=600');
    toast({ title: "Sharing to LinkedIn", description: "A new window has opened for sharing." });
  };

  const handleShareTwitter = () => {
    const text = `I just earned a certificate for completing "${certificate.courseName}"! 🎓 #learning #certificate`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400');
    toast({ title: "Sharing to Twitter", description: "A new window has opened for sharing." });
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

        <div className="relative rounded-lg overflow-hidden">
          <div
            ref={printRef}
            className="certificate p-8 md:p-12 relative"
            style={{
              aspectRatio: '1.414',
              border: template.borderStyle,
              ...(certificate.customBgUrl
                ? { backgroundImage: `url(${certificate.customBgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : { background: template.bgGradient }),
            }}
          >
            {/* Inner border */}
            <div
              className="absolute inset-4 pointer-events-none"
              style={{ border: `2px solid ${template.innerBorderColor}` }}
            />

            {/* Corner ornaments */}
            {template.ornamentStyle === 'corners' && (
              <>
                {['top-6 left-6', 'top-6 right-6 rotate-90', 'bottom-6 left-6 -rotate-90', 'bottom-6 right-6 rotate-180'].map((pos, i) => (
                  <div key={i} className={`absolute ${pos} w-6 h-6`}>
                    <div className="w-full h-0.5" style={{ background: template.accentColor }} />
                    <div className="w-0.5 h-full" style={{ background: template.accentColor }} />
                  </div>
                ))}
              </>
            )}

            {/* Seal ornament */}
            {template.ornamentStyle === 'seal' && (
              <div
                className="absolute bottom-8 right-8 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center opacity-20"
                style={{ border: `3px solid ${template.accentColor}` }}
              >
                <Award className="h-8 w-8 md:h-10 md:w-10" style={{ color: template.accentColor }} />
              </div>
            )}

            <div className="relative h-full flex flex-col items-center justify-between text-center">
              {/* Header */}
              <div>
                {certificate.vendorLogo ? (
                  <img
                    src={certificate.vendorLogo}
                    alt={certificate.vendorName}
                    className="h-12 w-12 md:h-16 md:w-16 mx-auto rounded-lg object-cover mb-3"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <Award
                    className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-3"
                    style={{ color: template.accentColor }}
                  />
                )}
                {certificate.vendorName && (
                  <p className="text-xs md:text-sm font-semibold mb-1" style={{ color: template.accentColor }}>
                    {certificate.vendorName}
                  </p>
                )}
                <h1
                  className="text-2xl md:text-4xl tracking-widest"
                  style={{ color: template.titleColor, fontFamily: template.titleFont }}
                >
                  {t.heading}
                </h1>
                <p className="text-xs md:text-sm tracking-wider mt-2" style={{ color: template.textColor }}>
                  {t.subheading}
                </p>
              </div>

              {/* Main content */}
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-xs md:text-sm mb-2" style={{ color: template.textColor }}>
                  {t.presentedTo}
                </p>
                <p
                  className="text-xl md:text-3xl italic my-4"
                  style={{ color: template.titleColor, fontFamily: template.titleFont }}
                >
                  {certificate.studentName}
                </p>
                <p className="text-sm md:text-base leading-relaxed max-w-lg" style={{ color: template.textColor }}>
                  {t.bodyText}<br />
                  <span className="font-semibold" style={{ color: template.titleColor }}>
                    "{certificate.courseName}"
                  </span>
                  <br />
                  {t.closingText?.replace('{hours}', String(certificate.courseHours))}
                </p>
                {t.congratsMessage && (
                  <p className="text-xs md:text-sm mt-3 italic max-w-md mx-auto" style={{ color: template.accentColor }}>
                    {t.congratsMessage}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="w-full flex justify-between px-4 md:px-12">
                <div className="text-center">
                  {certificate.signatureUrl && (
                    <img src={certificate.signatureUrl} alt="Signature" className="h-8 md:h-12 mx-auto mb-1 object-contain" />
                  )}
                  <div className="w-32 md:w-48 mb-2" style={{ borderTop: `1px solid ${template.accentColor}` }} />
                  <p className="text-xs md:text-sm font-medium" style={{ color: template.titleColor }}>
                    {certificate.instructorName}
                  </p>
                  <p className="text-xs" style={{ color: template.textColor }}>{t.signerTitle}</p>
                </div>
                <div className="text-center">
                  <div className="w-32 md:w-48 mb-2" style={{ borderTop: `1px solid ${template.accentColor}` }} />
                  <p className="text-xs md:text-sm font-medium" style={{ color: template.titleColor }}>
                    {format(new Date(certificate.completionDate), 'MMMM d, yyyy')}
                  </p>
                  <p className="text-xs" style={{ color: template.textColor }}>{t.footerLabel}</p>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="absolute bottom-2 left-0 right-0 flex items-end justify-between px-4">
                <div>
                  <p className="text-xs" style={{ color: template.textColor }}>
                    Certificate ID: {certificate.id}
                  </p>
                  {certificate.vendorName && (
                    <p className="text-[10px] mt-0.5" style={{ color: `${template.textColor}99` }}>
                      Powered by MasashiLearn
                    </p>
                  )}
                </div>
                <div className={`p-1 rounded shadow-sm ${isDark ? 'bg-white/10' : 'bg-white'}`}>
                  <QRCodeSVG
                    value={verificationUrl}
                    size={48}
                    level="M"
                    includeMargin={false}
                    fgColor={isDark ? '#ffffff' : '#000000'}
                    bgColor="transparent"
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
