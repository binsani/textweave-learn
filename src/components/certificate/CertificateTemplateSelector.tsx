import { useRef } from 'react';
import { Check, Award, Upload, Trash2, Loader2, ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { CERTIFICATE_TEMPLATES, getTemplate, type CertificateTemplate } from './certificateTemplates';
import { format } from 'date-fns';

interface CertificateTemplateSelectorProps {
  value: string;
  onChange: (templateId: string) => void;
  customBgUrl?: string;
  onBgUpload?: (file: File) => void;
  onBgRemove?: () => void;
  bgUploading?: boolean;
}

function TemplateThumb({ template, selected }: { template: CertificateTemplate; selected: boolean }) {
  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group',
        'border-2',
        selected
          ? 'border-primary ring-2 ring-primary/30 scale-[1.02]'
          : 'border-border hover:border-primary/50 hover:shadow-md'
      )}
    >
      <div
        className="aspect-[1.414] p-3 flex flex-col items-center justify-between text-center"
        style={{ background: template.previewGradient }}
      >
        <div className="flex flex-col items-center gap-0.5">
          <Award className="h-3.5 w-3.5" style={{ color: template.accentColor }} />
          <div
            className="text-[7px] font-bold tracking-[0.15em] uppercase"
            style={{ color: template.titleColor, fontFamily: template.titleFont }}
          >
            CERTIFICATE
          </div>
          <div className="text-[5px] tracking-wider" style={{ color: template.textColor }}>
            OF COMPLETION
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[5px]" style={{ color: template.textColor }}>This is to certify that</div>
          <div
            className="text-[8px] italic font-semibold"
            style={{ color: template.titleColor, fontFamily: template.titleFont }}
          >
            Student Name
          </div>
          <div className="text-[5px]" style={{ color: template.textColor }}>
            has completed the course
          </div>
        </div>
        <div className="flex justify-between w-full px-1">
          <div className="w-8 border-t" style={{ borderColor: template.accentColor }} />
          <div className="w-8 border-t" style={{ borderColor: template.accentColor }} />
        </div>
      </div>

      {selected && (
        <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-3 w-3 text-primary-foreground" />
        </div>
      )}

      <div className="px-2 py-1.5 bg-card border-t border-border">
        <p className="text-xs font-medium text-foreground truncate">{template.name}</p>
        <p className="text-[10px] text-muted-foreground truncate">{template.description}</p>
      </div>
    </div>
  );
}

function LivePreview({ templateId, customBgUrl }: { templateId: string; customBgUrl?: string }) {
  const template = getTemplate(templateId);
  const today = format(new Date(), 'MMMM d, yyyy');
  const bgStyle = customBgUrl
    ? { backgroundImage: `url(${customBgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: template.bgGradient };

  return (
    <div className="mt-6">
      <Separator className="mb-6" />
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <p className="text-sm font-medium text-foreground">
          Live Preview — <span className="text-muted-foreground font-normal">{template.name}</span>
        </p>
      </div>
      <div className="rounded-xl overflow-hidden shadow-lg border border-border">
        <div
          className="relative w-full p-6 sm:p-8 md:p-10"
          style={{
            aspectRatio: '1.414',
            border: template.borderStyle,
            ...bgStyle,
          }}
        >
          {/* Inner border */}
          <div
            className="absolute inset-3 sm:inset-4 pointer-events-none"
            style={{ border: `2px solid ${template.innerBorderColor}` }}
          />

          {/* Corner ornaments */}
          {template.ornamentStyle === 'corners' && (
            <>
              {['top-5 left-5', 'top-5 right-5 rotate-90', 'bottom-5 left-5 -rotate-90', 'bottom-5 right-5 rotate-180'].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-5 h-5`}>
                  <div className="w-full h-0.5" style={{ background: template.accentColor }} />
                  <div className="w-0.5 h-full" style={{ background: template.accentColor }} />
                </div>
              ))}
            </>
          )}

          {/* Seal ornament */}
          {template.ornamentStyle === 'seal' && (
            <div
              className="absolute bottom-6 right-6 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center opacity-20"
              style={{ border: `3px solid ${template.accentColor}` }}
            >
              <Award className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: template.accentColor }} />
            </div>
          )}

          <div className="relative h-full flex flex-col items-center justify-between text-center">
            {/* Header */}
            <div>
              <Award
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-2"
                style={{ color: template.accentColor }}
              />
              <h1
                className="text-lg sm:text-xl md:text-3xl tracking-widest"
                style={{ color: template.titleColor, fontFamily: template.titleFont }}
              >
                CERTIFICATE
              </h1>
              <p className="text-[10px] sm:text-xs tracking-wider mt-1" style={{ color: template.textColor }}>
                OF COMPLETION
              </p>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col justify-center py-2">
              <p className="text-[10px] sm:text-xs mb-1" style={{ color: template.textColor }}>
                This is to certify that
              </p>
              <p
                className="text-base sm:text-xl md:text-2xl italic my-2"
                style={{ color: template.titleColor, fontFamily: template.titleFont }}
              >
                Jane Doe
              </p>
              <p className="text-[10px] sm:text-xs leading-relaxed max-w-md mx-auto" style={{ color: template.textColor }}>
                has successfully completed the course<br />
                <span className="font-semibold" style={{ color: template.titleColor }}>
                  "Introduction to Web Development"
                </span>
                <br />
                comprising 24 hours of instruction
              </p>
            </div>

            {/* Footer */}
            <div className="w-full flex justify-between px-2 sm:px-6 md:px-10">
              <div className="text-center">
                <div className="w-20 sm:w-28 md:w-36 mb-1" style={{ borderTop: `1px solid ${template.accentColor}` }} />
                <p className="text-[9px] sm:text-xs font-medium" style={{ color: template.titleColor }}>
                  John Smith
                </p>
                <p className="text-[8px] sm:text-[10px]" style={{ color: template.textColor }}>Course Instructor</p>
              </div>
              <div className="text-center">
                <div className="w-20 sm:w-28 md:w-36 mb-1" style={{ borderTop: `1px solid ${template.accentColor}` }} />
                <p className="text-[9px] sm:text-xs font-medium" style={{ color: template.titleColor }}>
                  {today}
                </p>
                <p className="text-[8px] sm:text-[10px]" style={{ color: template.textColor }}>Date of Completion</p>
              </div>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-1 left-2 right-2 flex items-end justify-between">
              <p className="text-[8px]" style={{ color: `${template.textColor}99` }}>
                Certificate ID: CERT-A1B2C3D4
              </p>
              <div
                className="w-8 h-8 rounded border flex items-center justify-center text-[6px]"
                style={{ borderColor: `${template.textColor}40`, color: `${template.textColor}60` }}
              >
                QR
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CertificateTemplateSelector({
  value,
  onChange,
  customBgUrl,
  onBgUpload,
  onBgRemove,
  bgUploading,
}: CertificateTemplateSelectorProps) {
  const bgInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Certificate Template
        </CardTitle>
        <CardDescription>
          Choose how certificates will look for students who complete courses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CERTIFICATE_TEMPLATES.map((template) => (
            <div key={template.id} onClick={() => onChange(template.id)}>
              <TemplateThumb template={template} selected={value === template.id} />
            </div>
          ))}
        </div>

        {/* Custom Background Upload */}
        {onBgUpload && (
          <>
            <Separator className="my-6" />
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Custom Background Image
              </Label>
              <p className="text-sm text-muted-foreground">
                Upload a custom background image that will replace the template gradient on your certificates.
              </p>
              <div className="flex items-center gap-4">
                {customBgUrl ? (
                  <div className="relative h-20 w-28 rounded-lg border border-border overflow-hidden">
                    <img src={customBgUrl} alt="Certificate background" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="h-20 w-28 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => bgInputRef.current?.click()}
                      disabled={bgUploading}
                    >
                      {bgUploading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      {customBgUrl ? 'Replace' : 'Upload'}
                    </Button>
                    {customBgUrl && onBgRemove && (
                      <Button variant="ghost" size="sm" onClick={onBgRemove}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Recommended: 1400×1000px, landscape, max 5MB</p>
                </div>
                <input
                  ref={bgInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) onBgUpload(file);
                    e.target.value = '';
                  }}
                />
              </div>
            </div>
          </>
        )}

        <LivePreview templateId={value} customBgUrl={customBgUrl} />
      </CardContent>
    </Card>
  );
}
