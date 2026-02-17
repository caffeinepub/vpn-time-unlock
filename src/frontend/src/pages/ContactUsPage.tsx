import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle, Send } from 'lucide-react';
import { SUPPORT_EMAIL, APP_NAME } from '../config/support';

export default function ContactUsPage() {
  const mailtoLink = `mailto:${SUPPORT_EMAIL}?subject=Support Request - ${APP_NAME}`;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl mb-2">Contact Us</CardTitle>
          <CardDescription className="text-base">
            We're here to help! Get in touch with our support team.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Send us an email and we'll get back to you as soon as possible.
                </p>
                <a
                  href={mailtoLink}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium break-all"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">What can we help you with?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                <span>Technical support and troubleshooting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                <span>Account and billing inquiries</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                <span>Feature requests and feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                <span>Privacy and security concerns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                <span>General questions about {APP_NAME}</span>
              </li>
            </ul>
          </div>

          <Button asChild size="lg" className="w-full">
            <a href={mailtoLink}>
              <Send className="w-4 h-4 mr-2" />
              Send Email
            </a>
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>We typically respond within 24-48 hours</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
