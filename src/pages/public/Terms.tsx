import { Link } from 'react-router-dom';
import { FileText, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Terms() {
  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: February 1, 2025</p>
        </div>

        {/* Important Notice */}
        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please read these terms carefully before using Masashi LMS. By accessing or using our platform, you agree to be bound by these terms.
          </AlertDescription>
        </Alert>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using Masashi LMS ("the Platform"), you accept and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you must not access or use the Platform.
            </p>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the Platform. Continued use after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">2. Account Registration</h2>
            <p className="text-muted-foreground mb-4">
              To access certain features of the Platform, you must register for an account. When registering, you agree to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              You must be at least 13 years old to create an account. Users between 13-18 must have parental or guardian consent.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">3. Course Enrollment and Access</h2>
            
            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">3.1 Enrollment</h3>
            <p className="text-muted-foreground mb-4">
              When you enroll in a course, you are granted a limited, non-exclusive, non-transferable license to access and view the course content for personal, non-commercial purposes.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">3.2 Access Duration</h3>
            <p className="text-muted-foreground mb-4">
              Unless otherwise specified, course access is granted for the lifetime of the course on the Platform. We reserve the right to remove courses with reasonable notice.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">3.3 Restrictions</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>You may not share your account or course access with others</li>
              <li>You may not download, copy, or redistribute course content</li>
              <li>You may not use course content for commercial purposes</li>
              <li>You may not reverse engineer or extract source code</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">4. Payments and Refunds</h2>
            
            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">4.1 Pricing</h3>
            <p className="text-muted-foreground mb-4">
              All prices are displayed in USD unless otherwise stated. We reserve the right to modify pricing at any time, but changes will not affect existing purchases.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">4.2 Payment Processing</h3>
            <p className="text-muted-foreground mb-4">
              Payments are processed securely through third-party payment providers. By making a purchase, you agree to their terms of service.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">4.3 Refund Policy</h3>
            <p className="text-muted-foreground">
              We offer a 30-day money-back guarantee on all course purchases. To request a refund, contact our support team within 30 days of purchase. Subscription refunds are prorated based on usage.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">5. User Content</h2>
            <p className="text-muted-foreground mb-4">
              You may submit content to the Platform, including reviews, comments, and forum posts ("User Content"). By submitting User Content, you:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Grant us a non-exclusive, worldwide, royalty-free license to use, modify, and display your content</li>
              <li>Represent that you own or have the right to submit the content</li>
              <li>Agree not to submit content that is illegal, offensive, or infringes on others' rights</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We reserve the right to remove any User Content that violates these terms or is otherwise objectionable.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">6. Instructor Terms</h2>
            <p className="text-muted-foreground mb-4">
              If you become an instructor on the Platform, additional terms apply:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>You must own or have rights to all content you publish</li>
              <li>You are responsible for the accuracy and quality of your courses</li>
              <li>Revenue sharing is subject to the Instructor Agreement</li>
              <li>You must respond to student inquiries in a timely manner</li>
              <li>You must comply with our content guidelines and quality standards</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">7. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              The Platform and its original content (excluding User Content) are owned by Masashi LMS and protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-muted-foreground">
              Our trademarks and trade dress may not be used without our prior written permission. All third-party trademarks are the property of their respective owners.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">8. Prohibited Activities</h2>
            <p className="text-muted-foreground mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Impersonate others or provide false information</li>
              <li>Engage in harassment, abuse, or harmful behavior</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the Platform's operation or security</li>
              <li>Scrape, data mine, or use automated systems to access content</li>
              <li>Use the Platform for spam or unauthorized advertising</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT GUARANTEE THAT THE PLATFORM WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">10. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, MASASHI LMS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE PAST 12 MONTHS.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">11. Termination</h2>
            <p className="text-muted-foreground">
              We may terminate or suspend your account and access to the Platform at our sole discretion, without prior notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties. Upon termination, your right to access the Platform will immediately cease.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">12. Governing Law</h2>
            <p className="text-muted-foreground">
              These terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of San Francisco County, California.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">13. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  <strong>Masashi LMS Legal Team</strong><br />
                  Email: legal@masashilms.com<br />
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
            <Link to="/cookies" className="text-sm text-primary hover:underline">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
