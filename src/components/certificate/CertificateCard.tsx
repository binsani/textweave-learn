import { Award, Download, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface CertificateCardProps {
  id: string;
  courseName: string;
  completionDate: string;
  onView: () => void;
}

export function CertificateCard({ id, courseName, completionDate, onView }: CertificateCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{courseName}</h3>
            <p className="text-sm text-muted-foreground">
              Completed {format(new Date(completionDate), 'MMM d, yyyy')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ID: {id}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onView}>
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
