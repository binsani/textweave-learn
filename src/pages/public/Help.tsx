import { useState } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Search, BookOpen, MessageCircle, Mail, ChevronDown, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Link } from 'react-router-dom';

const faqCategories = [
  {
    title: 'Getting Started',
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'Click the "Sign Up" button in the top navigation, fill in your details, and verify your email address. You can also sign up using your Google or LinkedIn account for faster registration.',
      },
      {
        question: 'How do I enroll in a course?',
        answer: 'Browse our course catalog, select a course you\'re interested in, and click "Enroll Now". You\'ll be guided through the payment process if it\'s a paid course, or enrolled immediately if it\'s free.',
      },
      {
        question: 'Can I try a course before purchasing?',
        answer: 'Many courses offer free preview lessons. Look for the "Preview" button on the course page to watch sample content before making a purchase decision.',
      },
    ],
  },
  {
    title: 'Payments & Billing',
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise accounts.',
      },
      {
        question: 'Can I get a refund?',
        answer: 'Yes, we offer a 30-day money-back guarantee on all courses. If you\'re not satisfied, contact our support team within 30 days of purchase for a full refund.',
      },
      {
        question: 'Do you offer payment plans?',
        answer: 'Some premium courses and subscription plans offer monthly payment options. Check the course pricing page for available payment plans.',
      },
    ],
  },
  {
    title: 'Certificates',
    questions: [
      {
        question: 'How do I get a certificate?',
        answer: 'Complete all lessons and pass any required assessments in a course. Your certificate will be automatically generated and available in your dashboard.',
      },
      {
        question: 'Are the certificates verified?',
        answer: 'Yes, all certificates include a unique verification code. Employers and institutions can verify your certificate at our verification page.',
      },
      {
        question: 'Can I share my certificate on LinkedIn?',
        answer: 'Absolutely! Each certificate page has a "Share on LinkedIn" button that makes it easy to add your achievement to your professional profile.',
      },
    ],
  },
  {
    title: 'Technical Support',
    questions: [
      {
        question: 'Video not playing?',
        answer: 'Try refreshing the page, clearing your browser cache, or switching to a different browser. Ensure you have a stable internet connection. If the issue persists, contact our support team.',
      },
      {
        question: 'How do I reset my password?',
        answer: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to your inbox to create a new password.',
      },
      {
        question: 'Can I download courses for offline viewing?',
        answer: 'Some courses offer downloadable content. Look for the download icon next to lessons. Note that not all content may be available for download due to licensing restrictions.',
      },
    ],
  },
];

const supportChannels = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Get instant help from our support team',
    action: 'Start Chat',
    available: 'Available 24/7',
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send us a detailed message',
    action: 'Send Email',
    available: 'Response within 24 hours',
  },
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Browse our detailed guides',
    action: 'View Docs',
    available: 'Self-service',
  },
];

export default function Help() {
  useDocumentTitle('Help Center - MasashiLearn');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Search our knowledge base or browse frequently asked questions to find the answers you need.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for help..."
              className="pl-12 h-14 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {supportChannels.map((channel) => (
              <Card key={channel.title} className="text-center hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <channel.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{channel.title}</CardTitle>
                  <CardDescription>{channel.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="mb-2">
                    {channel.action}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground">{channel.available}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
              <Button variant="link" onClick={() => setSearchQuery('')}>
                Clear search
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredCategories.map((category) => (
                <div key={category.title}>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {category.title}
                  </h3>
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.questions.map((item, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`${category.title}-${index}`}
                        className="border rounded-lg px-4"
                      >
                        <AccordionTrigger className="text-left hover:no-underline">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help CTA */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
            Still need help?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Button asChild size="lg">
            <Link to="/contact">Contact Support</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
