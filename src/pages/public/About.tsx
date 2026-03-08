import { BookOpen, Users, Target, Award, Heart, Lightbulb } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Card, CardContent } from '@/components/ui/card';

const values = [
  {
    icon: Heart,
    title: 'Learner-First',
    description: 'Every decision we make prioritizes the learning experience and student success.',
  },
  {
    icon: Lightbulb,
    title: 'Deep Understanding',
    description: 'We believe in mastery over memorization, fostering true comprehension.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Learning is social. We build connections between learners and educators.',
  },
  {
    icon: Target,
    title: 'Accessibility',
    description: 'Quality education should be available to everyone, everywhere.',
  },
];

const stats = [
  { value: '50K+', label: 'Active Learners' },
  { value: '500+', label: 'Expert Instructors' },
  { value: '1,200+', label: 'Courses Available' },
  { value: '95%', label: 'Completion Rate' },
];

const team = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Founder & CEO',
    bio: 'Former professor with 15 years in educational technology.',
  },
  {
    name: 'Marcus Johnson',
    role: 'Head of Product',
    bio: 'Previously led product at major EdTech companies.',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Head of Content',
    bio: 'Curriculum designer passionate about accessible learning.',
  },
  {
    name: 'David Park',
    role: 'CTO',
    bio: 'Engineering leader focused on scalable learning platforms.',
  },
];

export default function About() {
  useDocumentTitle('About - MasashiLearn');
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mb-4 text-4xl font-bold font-serif md:text-5xl">About MasashiLearn</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            We're on a mission to transform how people learn—through thoughtful design, 
            expert instruction, and a commitment to deep understanding over superficial coverage.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold font-serif">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              MasashiLearn was founded on a simple belief: that learning should be transformative, 
              not transactional. In a world of quick fixes and surface-level content, we champion 
              the art of deep learning—the kind that changes how you think, not just what you know.
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Our text-first approach honors the tradition of scholarly learning while embracing 
              modern technology. We believe that carefully crafted written content, combined with 
              thoughtful assessments and community support, creates the most effective learning experience.
            </p>
          </div>
        </div>
      </section>


      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold font-serif">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mb-4 text-3xl font-bold font-serif">Join Our Learning Community</h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Whether you're looking to master a new skill, advance your career, or explore 
            your curiosity, MasashiLearn is here to guide your journey.
          </p>
        </div>
      </section>
    </div>
  );
}
