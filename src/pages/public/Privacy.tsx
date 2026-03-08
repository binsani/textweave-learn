import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, UserCheck, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Privacy() {
  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: February 1, 2025</p>
        </div>

        {/* Quick Overview */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Data Encryption</h3>
              <p className="text-sm text-muted-foreground">All data is encrypted in transit and at rest</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Eye className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Transparency</h3>
              <p className="text-sm text-muted-foreground">Clear explanations of how we use your data</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <UserCheck className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Your Control</h3>
              <p className="text-sm text-muted-foreground">You decide how your data is used</p>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              Welcome to MasashiLearn. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
            <p className="text-muted-foreground">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the platform.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Personal Information</h3>
            <p className="text-muted-foreground mb-4">
              We collect personal information that you voluntarily provide to us when you register on the platform, express an interest in obtaining information about us or our products and services, or otherwise contact us.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Name and contact information (email address, phone number)</li>
              <li>Account credentials (username, password)</li>
              <li>Payment information (processed securely through our payment providers)</li>
              <li>Profile information (avatar, bio, professional background)</li>
              <li>Educational history and learning preferences</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Usage patterns and learning activity</li>
              <li>Course progress and completion data</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Providing and maintaining our services</li>
              <li>Processing transactions and sending related information</li>
              <li>Personalizing your learning experience</li>
              <li>Sending administrative information and updates</li>
              <li>Responding to inquiries and offering support</li>
              <li>Analyzing usage to improve our platform</li>
              <li>Protecting against fraudulent or unauthorized activity</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">4. Sharing Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We may share your information in the following situations:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>With instructors:</strong> To facilitate course delivery and communication</li>
              <li><strong>With service providers:</strong> Third parties that perform services on our behalf</li>
              <li><strong>For business transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              <li><strong>With your consent:</strong> For any other purpose disclosed to you</li>
              <li><strong>Legal requirements:</strong> To comply with applicable laws or legal processes</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">5. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational security measures designed to protect your personal information. These include:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>SSL/TLS encryption for data in transit</li>
              <li>AES-256 encryption for data at rest</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">6. Your Privacy Rights</h2>
            <p className="text-muted-foreground mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Access:</strong> Request access to your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your data</li>
              <li><strong>Portability:</strong> Request transfer of your data</li>
              <li><strong>Opt-out:</strong> Opt out of marketing communications</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To exercise these rights, please contact us at privacy@masashilearn.com.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">7. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required by law. When we no longer need your personal information, we will securely delete or anonymize it.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">8. Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">9. Updates to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date. You are advised to review this policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">10. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about this privacy policy or our privacy practices, please contact us:
            </p>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  <strong>MasashiLearn Privacy Team</strong><br />
                  Email: privacy@masashilearn.com<br />
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
            <Link to="/terms" className="text-sm text-primary hover:underline">Terms of Service</Link>
            <Link to="/cookies" className="text-sm text-primary hover:underline">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
