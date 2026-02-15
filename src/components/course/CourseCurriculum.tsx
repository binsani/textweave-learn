import { useState } from 'react';
import { Section } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, Play, Lock, FileText, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseCurriculumProps {
  sections: Section[];
}

export function CourseCurriculum({ sections }: CourseCurriculumProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([sections[0]?.id || '']);

  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalDuration = sections.reduce(
    (acc, s) => acc + s.lessons.reduce((lAcc, l) => lAcc + l.readingTime, 0),
    0
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleAll = () => {
    if (expandedSections.length === sections.length) {
      setExpandedSections([]);
    } else {
      setExpandedSections(sections.map(s => s.id));
    }
  };

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold">Course Curriculum</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {sections.length} sections • {totalLessons} lessons • {totalDuration} min total
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={toggleAll}>
          {expandedSections.length === sections.length ? 'Collapse All' : 'Expand All'}
        </Button>
      </div>

      <div className="space-y-3">
        {sections.map((section, sectionIndex) => {
          const sectionDuration = section.lessons.reduce((acc, l) => acc + l.readingTime, 0);
          const isExpanded = expandedSections.includes(section.id);

          return (
            <Collapsible
              key={section.id}
              open={isExpanded}
              onOpenChange={() => toggleSection(section.id)}
            >
              <Card className={cn(isExpanded && 'ring-1 ring-primary/20')}>
                <CollapsibleTrigger className="w-full text-left">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn(
                          'flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium shrink-0',
                          isExpanded 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        )}>
                          {sectionIndex + 1}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium truncate">{section.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {section.lessons.length} lessons • {sectionDuration} min
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={cn(
                          'h-5 w-5 text-muted-foreground transition-transform shrink-0',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    </div>
                  </CardContent>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="border-t border-border">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className={cn(
                          'flex items-center justify-between gap-4 px-4 py-3 text-sm',
                          'hover:bg-muted/50 transition-colors',
                          lessonIndex !== section.lessons.length - 1 && 'border-b border-border'
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={cn(
                            'flex items-center justify-center h-7 w-7 rounded shrink-0',
                            lesson.isFree 
                              ? 'bg-primary/10 text-primary' 
                              : 'bg-muted text-muted-foreground'
                          )}>
                            {lesson.isFree ? (
                              <Play className="h-3.5 w-3.5" />
                            ) : (
                              <FileText className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className={cn(
                              'block truncate',
                              lesson.isFree ? 'text-foreground' : 'text-muted-foreground'
                            )}>
                              {lesson.title}
                            </span>
                          </div>
                          {lesson.isFree && (
                            <Badge variant="secondary" className="text-xs shrink-0">
                              Preview
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-xs">{lesson.readingTime} min</span>
                          {!lesson.isFree && (
                            <Lock className="h-3.5 w-3.5 ml-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>
    </section>
  );
}
