import { useEffect, useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useIsCurrentPrincipalAdmin } from './hooks/useAdminPanel';
import { useGetLogo } from './hooks/useAppLogo';
import { useIncrementInstalls } from './hooks/useAppMetrics';
import AuthGate from './components/AuthGate';
import VpnSessionPanel from './components/VpnSessionPanel';
import AdminPanelPage from './pages/AdminPanelPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import ContactUsPage from './pages/ContactUsPage';
import LoginButton from './components/LoginButton';
import { Shield, Settings, Heart } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { APP_NAME } from './config/support';

const INSTALL_TRACKED_KEY = 'vpn_install_tracked';

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCurrentPrincipalAdmin();
  const { data: logo } = useGetLogo();
  const incrementInstalls = useIncrementInstalls();
  const isAuthenticated = !!identity;

  // Pathname-based routing using History API
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Track install once per device when user authenticates
  useEffect(() => {
    const trackInstall = async () => {
      if (!isAuthenticated) return;
      
      const hasTracked = localStorage.getItem(INSTALL_TRACKED_KEY);
      if (hasTracked) return;

      try {
        await incrementInstalls.mutateAsync();
        localStorage.setItem(INSTALL_TRACKED_KEY, 'true');
      } catch (error: any) {
        // Silently fail if already tracked or user is blocked
        if (error.message?.includes('already active')) {
          localStorage.setItem(INSTALL_TRACKED_KEY, 'true');
        }
      }
    };

    trackInstall();
  }, [isAuthenticated, incrementInstalls]);

  // Normalize admin paths: /admin, /admin/, /admin/index.html all map to admin route
  const normalizedPath = currentPath.replace(/\/+$/, ''); // Remove trailing slashes
  const isAdminRoute = normalizedPath === '/admin' || normalizedPath.startsWith('/admin/');
  const isPrivacyRoute = normalizedPath === '/privacy-policy';
  const isTermsRoute = normalizedPath === '/terms-of-service';
  const isContactRoute = normalizedPath === '/contact-us';

  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Get logo URL if available
  const logoUrl = logo?.file?.getDirectURL();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col">
      <Toaster />
      {/* Header */}
      <header className="border-b border-emerald-200/50 dark:border-emerald-900/30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => handleNavigate('/')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 overflow-hidden">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="App Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Shield className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{APP_NAME}</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Ad-Powered Privacy</p>
              </div>
            </button>

            <div className="flex items-center gap-4">
              {isAuthenticated && isAdmin && !isPrivacyRoute && !isTermsRoute && !isContactRoute && (
                <button
                  onClick={() => handleNavigate(isAdminRoute ? '/' : '/admin')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                >
                  <Settings className="w-4 h-4" />
                  {isAdminRoute ? 'VPN Panel' : 'Admin Panel'}
                </button>
              )}
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {isPrivacyRoute ? (
          <PrivacyPolicyPage />
        ) : isTermsRoute ? (
          <TermsOfServicePage />
        ) : isContactRoute ? (
          <ContactUsPage />
        ) : (
          <AuthGate>
            {isAdminRoute ? <AdminPanelPage /> : <VpnSessionPanel />}
          </AuthGate>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-200/50 dark:border-emerald-900/30 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => handleNavigate('/privacy-policy')}
                className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline transition-colors"
              >
                Privacy Policy
              </button>
              <span className="text-gray-400">•</span>
              <button
                onClick={() => handleNavigate('/terms-of-service')}
                className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline transition-colors"
              >
                Terms of Service
              </button>
              <span className="text-gray-400">•</span>
              <button
                onClick={() => handleNavigate('/contact-us')}
                className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline transition-colors"
              >
                Contact Us
              </button>
            </div>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p className="flex items-center justify-center gap-1">
                © {new Date().getFullYear()} {APP_NAME}. Built with{' '}
                <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                    window.location.hostname
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
