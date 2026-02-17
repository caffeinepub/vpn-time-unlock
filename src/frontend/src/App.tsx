import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useIsCurrentPrincipalAdmin } from './hooks/useAdminPanel';
import AuthGate from './components/AuthGate';
import VpnSessionPanel from './components/VpnSessionPanel';
import AdminPanelPage from './pages/AdminPanelPage';
import LoginButton from './components/LoginButton';
import { Shield, Settings } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCurrentPrincipalAdmin();
  const isAuthenticated = !!identity;

  // Simple hash-based routing
  const currentHash = window.location.hash;
  const isAdminRoute = currentHash === '#/admin';

  const handleNavigate = (path: string) => {
    window.location.hash = path;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Toaster />
      {/* Header */}
      <header className="border-b border-emerald-200/50 dark:border-emerald-900/30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">SecureVPN</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Ad-Powered Privacy</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated && isAdmin && (
                <button
                  onClick={() => handleNavigate(isAdminRoute ? '#/' : '#/admin')}
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AuthGate>
          {isAdminRoute ? <AdminPanelPage /> : <VpnSessionPanel />}
        </AuthGate>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-200/50 dark:border-emerald-900/30 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              © {new Date().getFullYear()} SecureVPN. Built with love using{' '}
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
      </footer>
    </div>
  );
}
