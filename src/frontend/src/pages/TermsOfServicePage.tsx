import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, Mail } from 'lucide-react';
import { SUPPORT_EMAIL, APP_NAME } from '../config/support';

export default function TermsOfServicePage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl mb-2">Terms of Service</CardTitle>
          <CardDescription className="text-base">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using {APP_NAME}, you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service. We reserve the right to modify these terms at any time, 
              and your continued use of the service constitutes acceptance of any changes.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">2. Service Description</h2>
            <p className="text-muted-foreground mb-3">
              {APP_NAME} provides ad-supported VPN access. By watching advertisements, users unlock timed VPN sessions. 
              Our service includes:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
              <li>Secure encrypted VPN connections</li>
              <li>Time-limited access periods (2 hours per ad view)</li>
              <li>Session management and tracking</li>
              <li>User account management via Internet Identity</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">3. User Accounts</h2>
            <div className="space-y-3 text-muted-foreground">
              <div>
                <h3 className="font-medium text-foreground mb-2">3.1 Account Creation</h3>
                <p>
                  You must create an account using Internet Identity to access our service. You are responsible for maintaining 
                  the security of your account credentials and for all activities that occur under your account.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">3.2 Account Information</h3>
                <p>
                  You agree to provide accurate and complete information when creating your profile. You must update your information 
                  promptly if it changes.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">3.3 Account Termination</h3>
                <p>
                  We reserve the right to suspend or terminate your account at any time for violations of these Terms of Service, 
                  including but not limited to abuse of the service, fraudulent activity, or violation of applicable laws.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">4. Acceptable Use Policy</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>You agree NOT to use {APP_NAME} to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Engage in any illegal activities or violate any laws</li>
                <li>Distribute malware, viruses, or other harmful software</li>
                <li>Harass, threaten, or harm others</li>
                <li>Infringe on intellectual property rights</li>
                <li>Attempt to bypass or manipulate the ad-viewing system</li>
                <li>Access or attempt to access other users' accounts</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Use automated systems to access the service without authorization</li>
              </ul>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">5. Advertisement Requirements</h2>
            <p className="text-muted-foreground mb-3">
              Our service is supported by advertisements. To unlock VPN access:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
              <li>You must watch advertisements in their entirety</li>
              <li>You may not use ad-blocking software or attempt to skip ads</li>
              <li>Each completed ad view unlocks a 2-hour VPN session</li>
              <li>Sessions expire automatically after the time limit</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">6. Service Availability</h2>
            <p className="text-muted-foreground">
              We strive to provide reliable service, but we do not guarantee uninterrupted or error-free operation. 
              The service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control. 
              We reserve the right to modify, suspend, or discontinue any aspect of the service at any time without prior notice.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">7. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-3">
              To the maximum extent permitted by law, {APP_NAME} and its operators shall not be liable for:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
              <li>Any indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Service interruptions or data loss</li>
              <li>Actions taken based on information obtained through the service</li>
              <li>Third-party content or services accessed through our VPN</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              The service is provided "as is" without warranties of any kind, either express or implied.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">8. Privacy and Data Protection</h2>
            <p className="text-muted-foreground">
              Your use of the service is also governed by our Privacy Policy. Please review our Privacy Policy to understand 
              how we collect, use, and protect your personal information.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">9. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content, features, and functionality of {APP_NAME}, including but not limited to text, graphics, logos, and software, 
              are the property of {APP_NAME} or its licensors and are protected by copyright, trademark, and other intellectual property laws. 
              You may not copy, modify, distribute, or create derivative works without explicit permission.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">10. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms of Service shall be governed by and construed in accordance with applicable laws. 
              Any disputes arising from these terms or your use of the service shall be resolved through binding arbitration 
              or in the courts of competent jurisdiction.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">11. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. 
              Your continued use of the service after changes are posted constitutes your acceptance of the modified terms.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">12. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
              <Mail className="w-5 h-5 text-primary" />
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-primary hover:underline font-medium"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
          </section>

          <Separator />

          <section className="pt-4">
            <p className="text-xs text-muted-foreground text-center">
              By using {APP_NAME}, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
