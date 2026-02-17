import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Shield, Mail } from 'lucide-react';
import { SUPPORT_EMAIL, APP_NAME } from '../config/support';

export default function PrivacyPolicyPage() {
  const mailtoLink = `mailto:${SUPPORT_EMAIL}?subject=Privacy Inquiry - ${APP_NAME}`;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl mb-2">Privacy Policy</CardTitle>
          <CardDescription className="text-base">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">1. Introduction</h2>
            <p className="text-muted-foreground">
              Welcome to {APP_NAME}. We are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our VPN service.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">2. Information We Collect</h2>
            <div className="space-y-3 text-muted-foreground">
              <div>
                <h3 className="font-medium text-foreground mb-2">2.1 Account Information</h3>
                <p>
                  When you create an account using Internet Identity, we collect your unique principal identifier and the name you provide 
                  during profile setup. This information is used to manage your account and personalize your experience.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">2.2 Session Data</h3>
                <p>
                  We collect information about your VPN sessions, including session start times, duration, and expiration timestamps. 
                  This data is necessary to provide you with timed VPN access and manage your service usage.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">2.3 Usage Information</h3>
                <p>
                  We may collect information about how you interact with our service, including ad viewing completion and session management actions. 
                  This helps us improve our service and ensure proper functionality.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">3. How We Use Your Information</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide and maintain our VPN service</li>
                <li>Manage your account and authenticate your identity</li>
                <li>Track and enforce session time limits</li>
                <li>Display relevant advertisements to support our free service model</li>
                <li>Improve and optimize our service performance</li>
                <li>Communicate with you about service updates and support</li>
                <li>Enforce our Terms of Service and prevent abuse</li>
              </ul>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">4. Data Storage and Security</h2>
            <p className="text-muted-foreground mb-3">
              Your data is stored securely on the Internet Computer blockchain infrastructure. We implement industry-standard security measures 
              to protect your information from unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p className="text-muted-foreground">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially 
              acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">5. Third-Party Services</h2>
            <div className="space-y-3 text-muted-foreground">
              <div>
                <h3 className="font-medium text-foreground mb-2">5.1 Internet Identity</h3>
                <p>
                  We use Internet Identity for authentication. Please review Internet Identity's privacy policy to understand how they handle your data.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">5.2 Advertising Partners</h3>
                <p>
                  Our service is supported by advertisements. Ad providers may collect certain information to serve relevant ads. 
                  We recommend reviewing the privacy policies of our advertising partners.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">6. Your Rights</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your account and associated data</li>
                <li>Withdraw consent for data processing where applicable</li>
                <li>Lodge a complaint with relevant data protection authorities</li>
              </ul>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">7. Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our service is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. 
              If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">8. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
              and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">9. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy, your data, or our privacy practices, please contact us:
            </p>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email Support</p>
                  <a
                    href={mailtoLink}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <a href={mailtoLink}>
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </a>
              </Button>
            </div>
          </section>

          <Separator />

          <section className="text-center">
            <p className="text-xs text-muted-foreground">
              By using {APP_NAME}, you acknowledge that you have read and understood this Privacy Policy 
              and agree to its terms.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
