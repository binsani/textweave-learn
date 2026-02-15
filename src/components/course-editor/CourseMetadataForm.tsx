import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { X, Plus } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import type { CourseCategory, CourseLevel } from '@/types';

const courseFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters').max(200, 'Short description must be less than 200 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(5000, 'Description must be less than 5000 characters'),
  category: z.string().min(1, 'Please select a category'),
  level: z.string().min(1, 'Please select a level'),
  price: z.number().min(0, 'Price must be positive'),
  isFree: z.boolean(),
  thumbnail: z.string().optional(),
  learningObjectives: z.array(z.string()).min(1, 'Add at least one learning objective'),
  requirements: z.array(z.string()),
  tags: z.array(z.string()),
});

type CourseFormData = z.infer<typeof courseFormSchema>;

interface CourseMetadataFormProps {
  initialData?: Partial<CourseFormData> & { thumbnail?: string };
  onSave: (data: CourseFormData) => void;
}

const categories: { value: CourseCategory; label: string }[] = [
  { value: 'programming', label: 'Programming' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'business', label: 'Business' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'personal-development', label: 'Personal Development' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'humanities', label: 'Humanities' },
  { value: 'language', label: 'Language' },
];

const levels: { value: CourseLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export function CourseMetadataForm({ initialData, onSave }: CourseMetadataFormProps) {
  const [newObjective, setNewObjective] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newTag, setNewTag] = useState('');

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      shortDescription: initialData?.shortDescription || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      level: initialData?.level || '',
      price: initialData?.price || 0,
      isFree: initialData?.isFree ?? true,
      thumbnail: initialData?.thumbnail || '',
      learningObjectives: initialData?.learningObjectives || [],
      requirements: initialData?.requirements || [],
      tags: initialData?.tags || [],
    },
  });

  const watchIsFree = form.watch('isFree');
  const watchObjectives = form.watch('learningObjectives');
  const watchRequirements = form.watch('requirements');
  const watchTags = form.watch('tags');

  const addObjective = () => {
    if (newObjective.trim()) {
      form.setValue('learningObjectives', [...watchObjectives, newObjective.trim()]);
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    form.setValue('learningObjectives', watchObjectives.filter((_, i) => i !== index));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      form.setValue('requirements', [...watchRequirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    form.setValue('requirements', watchRequirements.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !watchTags.includes(newTag.trim())) {
      form.setValue('tags', [...watchTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    form.setValue('tags', watchTags.filter((_, i) => i !== index));
  };

  const onSubmit = (data: CourseFormData) => {
    onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Python Programming Fundamentals" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief summary that appears in course cards..."
                      className="resize-none h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Max 200 characters. Shows on course cards.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed course description with learning outcomes..."
                      className="resize-none h-40"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Supports markdown formatting.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thumbnail Upload */}
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Thumbnail</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      aspect={16 / 9}
                      placeholder="Upload thumbnail (16:9)"
                      className="max-w-md"
                    />
                  </FormControl>
                  <FormDescription>Recommended: 1280×720px (16:9 ratio)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Category & Level */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Category & Level</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {levels.map((lvl) => (
                        <SelectItem key={lvl.value} value={lvl.value}>
                          {lvl.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Free Course</FormLabel>
                    <FormDescription>
                      Make this course available for free
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {!watchIsFree && (
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="29.99"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Learning Objectives */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Learning Objectives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="What students will learn..."
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
              />
              <Button type="button" onClick={addObjective} size="icon" variant="secondary">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {watchObjectives.map((obj, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                  <span className="flex-1 text-sm">{obj}</span>
                  <Button
                    type="button"
                    onClick={() => removeObjective(i)}
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            {form.formState.errors.learningObjectives && (
              <p className="text-sm text-destructive">
                {form.formState.errors.learningObjectives.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Prior knowledge needed..."
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
              />
              <Button type="button" onClick={addRequirement} size="icon" variant="secondary">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {watchRequirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                  <span className="flex-1 text-sm">{req}</span>
                  <Button
                    type="button"
                    onClick={() => removeRequirement(i)}
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add tags for discoverability..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="icon" variant="secondary">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {watchTags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="gap-1 pr-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(i)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Save Course Details
          </Button>
        </div>
      </form>
    </Form>
  );
}
