import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Check, Zap, Crown, Building2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const plans = [
  {
    name: 'Free',
    icon: Zap,
    description: 'Perfect for exploring and casual learning',
    price: '$0',
    period: 'forever',
    features: [
      'Access to free courses',
      'Basic progress tracking',
      'Community forum access',
      'Mobile-friendly learning',
      'Course bookmarks (up to 10)',
    ],
    cta: 'Get Started',
    ctaVariant: 'outline' as const,
    popular: false,
  },
  {
    name: 'Pro',
    icon: Crown,
    description: 'For dedicated learners seeking mastery',
    price: '$19',
    period: 'per month',
    features: [
      'Unlimited course access',
      'Advanced progress analytics',
      'Downloadable certificates',
      'Priority support',
      'Offline course access',
      'Personal notes & highlights',
      'Ad-free experience',
      'Early access to new courses',
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'default' as const,
    popular: true,
  },
  {
    name: 'Team',
    icon: Building2,
    description: 'For organizations and learning teams',
    price: '$49',
    period: 'per user/month',
    features: [
      'Everything in Pro',
      'Team management dashboard',
      'Custom learning paths',
      'Progress reporting',
      'SSO integration',
      'Dedicated account manager',
      'API access',
      'Custom branding options',
    ],
    cta: 'Contact Sales',
    ctaVariant: 'outline' as const,
    popular: false,
  },
];

const faqs = [
  {
    question: 'Can I switch plans at any time?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. If you upgrade, you\'ll be charged the prorated difference. If you downgrade, the change will take effect at the start of your next billing cycle.',
  },
  {
    question: 'Is there a free trial for the Pro plan?',
    answer: 'Absolutely! We offer a 14-day free trial for the Pro plan. No credit card required to start. You can explore all Pro features and decide if it\'s right for you.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and for Team plans, we also offer invoice billing.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'Yes, we offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, contact our support team for a full refund.',
  },
  {
    question: 'Do certificates expire?',
    answer: 'No, certificates never expire. Once you earn a certificate, it\'s yours forever and can be verified at any time using our verification system.',
  },
  {
    question: 'What\'s included in the Team plan?',
    answer: 'The Team plan includes everything in Pro, plus team management features like a centralized dashboard, custom learning paths, detailed reporting, SSO integration, and a dedicated account manager.',
  },
];

const comparisonFeatures = [
  { name: 'Free courses', free: true, pro: true, team: true },
  { name: 'Premium courses', free: false, pro: true, team: true },
  { name: 'Progress tracking', free: 'Basic', pro: 'Advanced', team: 'Advanced' },
  { name: 'Certificates', free: false, pro: true, team: true },
  { name: 'Offline access', free: false, pro: true, team: true },
  { name: 'Support', free: 'Community', pro: 'Priority', team: 'Dedicated' },
  { name: 'Custom learning paths', free: false, pro: false, team: true },
  { name: 'Team dashboard', free: false, pro: false, team: true },
];

export default function Pricing() {
  useDocumentTitle('Pricing - Masashi LMS');
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold font-serif md:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Choose the plan that fits your learning journey. Start free and upgrade 
            when you're ready for more.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col ${
                  plan.popular ? 'border-primary shadow-lg scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <plan.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-serif">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">/{plan.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={plan.ctaVariant}
                    className="w-full"
                    asChild
                  >
                    <Link to={plan.name === 'Team' ? '/contact' : '/signup'}>
                      {plan.cta}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold font-serif">
            Compare Plans
          </h2>
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-4 text-left font-medium">Feature</th>
                  <th className="py-4 px-4 text-center font-medium">Free</th>
                  <th className="py-4 px-4 text-center font-medium">Pro</th>
                  <th className="py-4 px-4 text-center font-medium">Team</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature) => (
                  <tr key={feature.name} className="border-b">
                    <td className="py-4 px-4 text-sm">{feature.name}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        <span className="text-sm">{feature.free}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        <span className="text-sm">{feature.pro}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof feature.team === 'boolean' ? (
                        feature.team ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        <span className="text-sm">{feature.team}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold font-serif">
                Frequently Asked Questions
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold font-serif">
            Ready to Start Learning?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Join thousands of learners who have transformed their careers with Masashi LMS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/signup">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
