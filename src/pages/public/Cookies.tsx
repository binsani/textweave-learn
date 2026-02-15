import { Link } from 'react-router-dom';
import { Cookie, Settings, BarChart3, Shield, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const cookieTypes = [
  {
    icon: Shield,
    title: 'Essential Cookies',
    description: 'Required for the platform to function properly. These cannot be disabled.',
    required: true,
    examples: ['Session management', 'Security features', 'Load balancing'],
  },
  {
    icon: Settings,
    title: 'Functional Cookies',
    description: 'Remember your preferences and settings for a better experience.',
    required: false,
    examples: ['Language preferences', 'Theme settings', 'Video player preferences'],
  },
  {
    icon: BarChart3,
    title: 'Analytics Cookies',
    description: 'Help us understand how visitors use the platform to improve our services.',
    required: false,
    examples: ['Page views', 'Session duration', 'Navigation patterns'],
  },
  {
    icon: Users,
    title: 'Marketing Cookies',
    description: 'Used to deliver relevant advertisements and track campaign effectiveness.',
    required: false,
    examples: ['Ad targeting', 'Conversion tracking', 'Retargeting'],
  },
];

export default function Cookies() {
  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Cookie className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: February 1, 2025</p>
        </div>

        {/* Cookie Preferences Card */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Manage Cookie Preferences</CardTitle>
            <CardDescription>
              Choose which cookies you want to accept. You can change these settings at any time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {cookieTypes.map((cookie) => (
              <div key={cookie.title} className="flex items-start justify-between gap-4 pb-4 border-b last:border-0 last:pb-0">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                    <cookie.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <Label htmlFor={cookie.title} className="text-base font-medium">
                      {cookie.title}
                      {cookie.required && (
                        <span className="ml-2 text-xs text-muted-foreground">(Required)</span>
                      )}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">{cookie.description}</p>
                  </div>
                </div>
                <Switch 
                  id={cookie.title} 
                  defaultChecked={cookie.required} 
                  disabled={cookie.required}
                />
              </div>
            ))}
            <div className="flex gap-3 pt-4">
              <Button>Save Preferences</Button>
              <Button variant="outline">Accept All</Button>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">What Are Cookies?</h2>
            <p className="text-muted-foreground mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the site owners.
            </p>
            <p className="text-muted-foreground">
              Cookies allow us to recognize you and remember your preferences, provide a secure experience, and understand how you use our platform so we can improve it.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Types of Cookies We Use</h2>
            
            {cookieTypes.map((cookie) => (
              <div key={cookie.title} className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{cookie.title}</h3>
                <p className="text-muted-foreground mb-3">{cookie.description}</p>
                <p className="text-sm text-muted-foreground">
                  <strong>Examples:</strong> {cookie.examples.join(', ')}
                </p>
              </div>
            ))}
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Third-Party Cookies</h2>
            <p className="text-muted-foreground mb-4">
              Some cookies are placed by third-party services that appear on our pages. We use trusted partners for analytics, advertising, and social media integration:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Google Analytics:</strong> Helps us understand how visitors use our platform</li>
              <li><strong>Stripe:</strong> Processes payments securely</li>
              <li><strong>Intercom:</strong> Provides customer support chat functionality</li>
              <li><strong>YouTube:</strong> Embeds video content in courses</li>
              <li><strong>Social Media:</strong> Enables sharing content on social platforms</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">How to Control Cookies</h2>
            
            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Browser Settings</h3>
            <p className="text-muted-foreground mb-4">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>View what cookies are stored on your device</li>
              <li>Delete all or specific cookies</li>
              <li>Block all cookies or only third-party cookies</li>
              <li>Receive notifications when cookies are set</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Note that blocking certain cookies may impact your experience on our platform.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Opt-Out Links</h3>
            <p className="text-muted-foreground mb-4">
              You can also opt out of specific third-party cookies:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline">Google Analytics Opt-out</a></li>
              <li>Advertising cookies: <a href="https://www.youronlinechoices.com" className="text-primary hover:underline">Your Online Choices</a></li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Cookie Retention</h2>
            <p className="text-muted-foreground mb-4">
              The retention period for cookies varies depending on their purpose:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent cookies:</strong> Remain until they expire or you delete them (typically 30 days to 2 years)</li>
              <li><strong>Analytics cookies:</strong> Up to 2 years</li>
              <li><strong>Marketing cookies:</strong> Up to 1 year</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Updates to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. When we make changes, we will update the "Last updated" date at the top of this page. We encourage you to periodically review this page for the latest information.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  <strong>Masashi LMS Privacy Team</strong><br />
                  Email: privacy@masashilms.com<br />
                  Address: 123 Learning Street, San Francisco, CA 94102
                </p>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Related Links */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">Related policies:</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy" className="text-sm text-primary hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-primary hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
