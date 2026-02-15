import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Eye, Clock, BookOpen } from 'lucide-react';
import { MarkdownRenderer } from '@/components/learning/MarkdownRenderer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Lesson } from '@/types';

interface LessonEditorProps {
  lesson: Lesson;
  onSave: (lesson: Lesson) => void;
  onBack: () => void;
}

export function LessonEditor({ lesson, onSave, onBack }: LessonEditorProps) {
  const [editedLesson, setEditedLesson] = useState<Lesson>(lesson);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const handleSave = () => {
    // Calculate reading time based on content (roughly 200 words per minute)
    const wordCount = editedLesson.content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    onSave({
      ...editedLesson,
      readingTime,
      slug: editedLesson.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl font-serif font-bold">Edit Lesson</h2>
            <p className="text-sm text-muted-foreground">{lesson.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Lesson
          </Button>
        </div>
      </div>

      {/* Lesson Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Lesson Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title</Label>
              <Input
                id="title"
                value={editedLesson.title}
                onChange={(e) => setEditedLesson({ ...editedLesson, title: e.target.value })}
                placeholder="Enter lesson title..."
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <Label>Free Preview</Label>
                <p className="text-xs text-muted-foreground">
                  Allow non-enrolled users to view
                </p>
              </div>
              <Switch
                checked={editedLesson.isFree}
                onCheckedChange={(checked) => setEditedLesson({ ...editedLesson, isFree: checked })}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              ~{Math.max(1, Math.ceil(editedLesson.content.split(/\s+/).length / 200))} min read
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {editedLesson.content.split(/\s+/).length} words
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Content Editor */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-serif">Lesson Content</CardTitle>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')}>
              <TabsList className="h-9">
                <TabsTrigger value="edit" className="text-xs">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Edit
                </TabsTrigger>
                <TabsTrigger value="preview" className="text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {activeTab === 'edit' ? (
            <div className="space-y-3">
              <Textarea
                value={editedLesson.content}
                onChange={(e) => setEditedLesson({ ...editedLesson, content: e.target.value })}
                placeholder="Write your lesson content using Markdown...

# Heading 1
## Heading 2

Regular paragraph text with **bold** and *italic*.

```python
# Code blocks are supported
print('Hello, World!')
```

:::tip
Special callout blocks for tips, notes, and warnings.
:::"
                className="min-h-[500px] font-mono text-sm resize-y"
              />
              <p className="text-xs text-muted-foreground">
                Supports Markdown, code blocks, tables, and special callouts (:::tip, :::note, :::warning)
              </p>
            </div>
          ) : (
            <div className="border rounded-lg p-6 min-h-[500px] bg-card">
              {editedLesson.content ? (
                <MarkdownRenderer content={editedLesson.content} />
              ) : (
                <p className="text-muted-foreground text-center py-20">
                  No content to preview. Start writing in the Edit tab.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
