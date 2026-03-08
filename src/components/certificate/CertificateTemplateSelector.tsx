import { Check, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CERTIFICATE_TEMPLATES, type CertificateTemplate } from './certificateTemplates';

interface CertificateTemplateSelectorProps {
  value: string;
  onChange: (templateId: string) => void;
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
      {/* Mini certificate preview */}
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

      {/* Selected check */}
      {selected && (
        <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-3 w-3 text-primary-foreground" />
        </div>
      )}

      {/* Name bar */}
      <div className="px-2 py-1.5 bg-card border-t border-border">
        <p className="text-xs font-medium text-foreground truncate">{template.name}</p>
        <p className="text-[10px] text-muted-foreground truncate">{template.description}</p>
      </div>
    </div>
  );
}

export function CertificateTemplateSelector({ value, onChange }: CertificateTemplateSelectorProps) {
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
      </CardContent>
    </Card>
  );
}
