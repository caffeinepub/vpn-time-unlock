import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCurrentPrincipalAdmin, useGetAdminOverview } from '../hooks/useAdminPanel';
import { useGetAppAdMobConfig, useSetAppAdMobConfig } from '../hooks/useAppAdMobConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ShieldCheck, ShieldX, Users, AlertCircle, Save, Smartphone } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function AdminPanelPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCurrentPrincipalAdmin();
  const { data: overview, isLoading: overviewLoading } = useGetAdminOverview();
  const { data: adMobConfig, isLoading: adMobConfigLoading } = useGetAppAdMobConfig();
  const setAdMobConfig = useSetAppAdMobConfig();

  const [appId, setAppId] = useState('');
  const [rewardedAdUnitId, setRewardedAdUnitId] = useState('');

  const callerPrincipal = identity?.getPrincipal().toString() || 'Not authenticated';

  // Initialize form fields when config loads
  useState(() => {
    if (adMobConfig) {
      setAppId(adMobConfig.appId);
      setRewardedAdUnitId(adMobConfig.rewardedAdUnitId);
    }
  });

  // Update form when config changes
  if (adMobConfig && appId === '' && rewardedAdUnitId === '') {
    setAppId(adMobConfig.appId);
    setRewardedAdUnitId(adMobConfig.rewardedAdUnitId);
  }

  const handleSaveAdMobConfig = async () => {
    try {
      await setAdMobConfig.mutateAsync({
        appId: appId.trim(),
        rewardedAdUnitId: rewardedAdUnitId.trim(),
      });
      toast.success('AdMob configuration saved successfully');
    } catch (error: any) {
      console.error('Failed to save AdMob config:', error);
      toast.error(error.message || 'Failed to save AdMob configuration');
    }
  };

  // Loading state
  if (isAdminLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Checking admin status...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Access denied for non-admins
  if (!isAdmin) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-3">
              <ShieldX className="w-8 h-8 text-destructive" />
              <div>
                <CardTitle className="text-2xl">Access Denied</CardTitle>
                <CardDescription>You do not have permission to view this page</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>Unauthorized</AlertTitle>
              <AlertDescription>
                Only administrators can access the admin panel. If you believe you should have access,
                please contact the system administrator.
              </AlertDescription>
            </Alert>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Your Principal:</strong>
              </p>
              <p className="text-xs font-mono mt-1 break-all">{callerPrincipal}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin panel content
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Admin Status Card */}
      <Card className="border-emerald-500/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              <div>
                <CardTitle className="text-2xl">Admin Panel</CardTitle>
                <CardDescription>System administration and user management</CardDescription>
              </div>
            </div>
            <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
              Administrator
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">
              <strong>Your Principal ID:</strong>
            </p>
            <p className="text-xs font-mono break-all">{callerPrincipal}</p>
          </div>
        </CardContent>
      </Card>

      {/* AdMob Settings Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-primary" />
            <div>
              <CardTitle>AdMob Settings</CardTitle>
              <CardDescription>Configure your Google AdMob integration</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {adMobConfigLoading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading AdMob configuration...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="appId">AdMob App ID</Label>
                  <Input
                    id="appId"
                    type="text"
                    placeholder="ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your AdMob Application ID from the AdMob console
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rewardedAdUnitId">Rewarded Ad Unit ID</Label>
                  <Input
                    id="rewardedAdUnitId"
                    type="text"
                    placeholder="ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY"
                    value={rewardedAdUnitId}
                    onChange={(e) => setRewardedAdUnitId(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your Rewarded Ad Unit ID for unlocking VPN sessions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSaveAdMobConfig}
                  disabled={setAdMobConfig.isPending || !appId.trim() || !rewardedAdUnitId.trim()}
                  className="min-w-32"
                >
                  {setAdMobConfig.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
                {adMobConfig && (
                  <p className="text-xs text-muted-foreground">
                    Last saved configuration is active
                  </p>
                )}
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  These settings control the AdMob integration for your app. Make sure to use your actual
                  AdMob IDs from the{' '}
                  <a
                    href="https://admob.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    AdMob console
                  </a>
                  . The web prototype simulates ads; real integration requires native Android implementation.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users Overview Card - Placeholder */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <div>
              <CardTitle>Users & Sessions Overview</CardTitle>
              <CardDescription>All registered users and their active sessions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Feature In Development</AlertTitle>
            <AlertDescription>
              The user overview feature requires additional backend functionality. The backend needs to
              implement a <code className="text-xs bg-muted px-1 py-0.5 rounded">getAdminOverview()</code> method
              that returns user principals, profiles, and session data.
            </AlertDescription>
          </Alert>
          <div className="mt-6 py-8 text-center text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">User Management Coming Soon</p>
            <p className="text-sm mt-2">
              Once the backend is updated, you'll be able to view all users and their sessions here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
