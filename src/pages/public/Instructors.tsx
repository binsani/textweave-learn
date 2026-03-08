import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  GraduationCap, 
  DollarSign, 
  Users, 
  BarChart3, 
  Globe, 
  Clock, 
  Video, 
  Award,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const applicationSchema = z.object({
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters').max(50),
  email: z.string().trim().email('Please enter a valid email address').max(255),
  phone: z.string().trim().optional(),
  expertise: z.string().min(1, 'Please select your area of expertise'),
  experience: z.string().min(1, 'Please select your teaching experience'),
  bio: z.string().trim().min(50, 'Please provide at least 50 characters about yourself').max(1000),
  courseIdea: z.string().trim().min(20, 'Please describe your course idea in at least 20 characters').max(2000),
  portfolio: z.string().trim().url('Please enter a valid URL').optional().or(z.literal('')),
  agreeTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const benefits = [
  {
    icon: DollarSign,
    title: 'Competitive Revenue Share',
    description: 'Earn up to 70% of course sales with our instructor-friendly revenue model.',
  },
  {
    icon: Users,
    title: 'Reach Global Learners',
    description: 'Access our community of thousands of eager students from around the world.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track your course performance with detailed insights and student engagement metrics.',
  },
  {
    icon: Video,
    title: 'Professional Tools',
    description: 'Use our intuitive course builder to create engaging, multimedia-rich content.',
  },
  {
    icon: Clock,
    title: 'Flexible Schedule',
    description: 'Create content on your own time. Record once, earn forever.',
  },
  {
    icon: Award,
    title: 'Build Your Brand',
    description: 'Establish yourself as an industry expert and grow your personal brand.',
  },
];

const stats = [
  { value: '10K+', label: 'Active Instructors' },
  { value: '$2M+', label: 'Paid to Instructors' },
  { value: '500K+', label: 'Students Enrolled' },
  { value: '4.8', label: 'Average Rating' },
];

const requirements = [
  'Expertise in your subject area with practical experience',
  'Passion for teaching and helping others learn',
  'Ability to create clear, engaging video content',
  'Commitment to responding to student questions',
  'Original content that doesn\'t infringe on copyrights',
];

export default function Instructors() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      expertise: '',
      experience: '',
      bio: '',
      courseIdea: '',
      portfolio: '',
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Application data would be sent to an API endpoint
    
    toast({
      title: 'Application Submitted!',
      description: 'Thank you for applying. Our team will review your application and get back to you within 5-7 business days.',
    });
    
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="mb-4 text-4xl font-bold font-serif md:text-5xl">
              Become an Instructor
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
              Share your expertise with thousands of learners worldwide. Create courses, 
              build your brand, and earn money doing what you love.
            </p>
            <Button size="lg" asChild>
              <a href="#apply">
                Start Your Application
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold font-serif">Why Teach on MasashiLearn?</h2>
            <p className="text-muted-foreground">
              Join a platform that puts instructors first. We provide the tools, 
              support, and audience you need to succeed.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold font-serif">How It Works</h2>
            <p className="text-muted-foreground">
              From application to your first sale in four simple steps.
            </p>
          </div>
          
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { step: '1', title: 'Apply', description: 'Submit your application with your expertise and course idea.' },
                { step: '2', title: 'Get Approved', description: 'Our team reviews your application within 5-7 business days.' },
                { step: '3', title: 'Create', description: 'Use our course builder to create engaging content.' },
                { step: '4', title: 'Earn', description: 'Publish your course and start earning from day one.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="mb-2 font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="mb-4 text-3xl font-bold font-serif">What We're Looking For</h2>
              <p className="text-muted-foreground">
                We welcome instructors from all backgrounds who meet these basic requirements.
              </p>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply" className="bg-muted/30 py-16 md:py-24 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-12">
              <h2 className="mb-4 text-3xl font-bold font-serif">Apply to Become an Instructor</h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll review your application within 5-7 business days.
              </p>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+1 (555) 000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="expertise"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Area of Expertise *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your expertise" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="programming">Programming & Development</SelectItem>
                                <SelectItem value="design">Design & Creative</SelectItem>
                                <SelectItem value="business">Business & Marketing</SelectItem>
                                <SelectItem value="data">Data Science & Analytics</SelectItem>
                                <SelectItem value="language">Language Learning</SelectItem>
                                <SelectItem value="music">Music & Audio</SelectItem>
                                <SelectItem value="photography">Photography & Video</SelectItem>
                                <SelectItem value="health">Health & Fitness</SelectItem>
                                <SelectItem value="personal">Personal Development</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teaching Experience *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select experience level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">No formal teaching experience</SelectItem>
                                <SelectItem value="informal">Informal teaching (workshops, mentoring)</SelectItem>
                                <SelectItem value="1-3">1-3 years of teaching</SelectItem>
                                <SelectItem value="3-5">3-5 years of teaching</SelectItem>
                                <SelectItem value="5+">5+ years of teaching</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>About You *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your background, expertise, and why you want to teach..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Minimum 50 characters. Share your professional background and teaching philosophy.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="courseIdea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Idea *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the course you want to create. What will students learn? Who is your target audience?"
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Minimum 20 characters. Be specific about your course topic and learning outcomes.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="portfolio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portfolio / LinkedIn URL</FormLabel>
                          <FormControl>
                            <Input 
                              type="url" 
                              placeholder="https://linkedin.com/in/yourprofile" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Optional. Share a link to your portfolio, LinkedIn, or relevant work samples.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="agreeTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the{' '}
                              <Link to="/terms" className="text-primary hover:underline">
                                Terms of Service
                              </Link>{' '}
                              and{' '}
                              <Link to="/privacy" className="text-primary hover:underline">
                                Instructor Agreement
                              </Link>{' '}
                              *
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Globe className="mx-auto mb-6 h-12 w-12 text-primary" />
          <h2 className="mb-4 text-3xl font-bold font-serif">
            Ready to Impact Learners Worldwide?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Join thousands of instructors who are sharing their knowledge and 
            earning income on Masashi LMS.
          </p>
          <Button size="lg" asChild>
            <a href="#apply">Start Your Application</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
