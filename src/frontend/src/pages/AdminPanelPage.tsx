import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCurrentPrincipalAdmin, useGetAdminOverview } from '../hooks/useAdminPanel';
import { useGetAppAdMobConfig, useSetAppAdMobConfig } from '../hooks/useAppAdMobConfig';
import { useGetLogo, useUploadLogo } from '../hooks/useAppLogo';
import { useGetAppMetrics } from '../hooks/useAppMetrics';
import { useBlockUser, useUnblockUser } from '../hooks/useUserBlocking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ShieldCheck, ShieldX, Users, AlertCircle, Save, Smartphone, Image as ImageIcon, Upload, RefreshCw, Ban, CheckCircle, TrendingUp, Activity, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { ExternalBlob, UserStatus } from '../backend';
import { Principal } from '@dfinity/principal';

export default function AdminPanelPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading, isError: isAdminError, error: adminError, refetch: refetchAdminStatus } = useIsCurrentPrincipalAdmin();
  const { data: overview, isLoading: overviewLoading, isError: overviewError, error: overviewErrorObj, refetch: refetchOverview } = useGetAdminOverview();
  const { data: adMobConfig, isLoading: adMobConfigLoading, isError: adMobConfigError, error: adMobConfigErrorObj, refetch: refetchAdMobConfig } = useGetAppAdMobConfig();
  const { data: currentLogo, isLoading: logoLoading } = useGetLogo();
  const { data: metrics, isLoading: metricsLoading } = useGetAppMetrics();
  const setAdMobConfig = useSetAppAdMobConfig();
  const uploadLogo = useUploadLogo();
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();

  const [appId, setAppId] = useState('');
  const [rewardedAdUnitId, setRewardedAdUnitId] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasInitializedAdMob, setHasInitializedAdMob] = useState(false);

  const callerPrincipal = identity?.getPrincipal().toString() || 'Not authenticated';

  // Initialize AdMob form fields when config loads
  useEffect(() => {
    if (adMobConfig && !hasInitializedAdMob) {
      setAppId(adMobConfig.appId);
      setRewardedAdUnitId(adMobConfig.rewardedAdUnitId);
      setHasInitializedAdMob(true);
    }
  }, [adMobConfig, hasInitializedAdMob]);

  // Calculate metrics from overview
  const totalUserCount = overview?.userProfiles.length || 0;
  const activeUsersCount = overview?.sessions.filter(([_, session]) => {
    const now = BigInt(Date.now()) * BigInt(1_000_000);
    return session.unlockExpiresAt > now;
  }).length || 0;

  // Get metrics from backend
  const totalInstalls = metrics ? Number(metrics.installs) : 0;
  const activeCount = metrics ? Number(metrics.activeCount) : 0;
  const blockedCount = metrics ? Number(metrics.blockedCount) : 0;

  // Handle logo file selection
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handleUploadLogo = async () => {
    if (!logoFile) {
      toast.error('Please select a logo file');
      return;
    }

    try {
      const arrayBuffer = await logoFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await uploadLogo.mutateAsync({
        mediaType: logoFile.type,
        file: blob,
      });

      toast.success('Logo uploaded successfully');
      setLogoFile(null);
      setLogoPreview(null);
      setUploadProgress(0);
    } catch (error: any) {
      console.error('Failed to upload logo:', error);
      toast.error(error.message || 'Failed to upload logo');
      setUploadProgress(0);
    }
  };

  const handleBlockUser = async (userPrincipal: Principal) => {
    try {
      await blockUser.mutateAsync(userPrincipal);
      toast.success('User blocked successfully');
    } catch (error: any) {
      console.error('Failed to block user:', error);
      toast.error(error.message || 'Failed to block user');
    }
  };

  const handleUnblockUser = async (userPrincipal: Principal) => {
    try {
      await unblockUser.mutateAsync(userPrincipal);
      toast.success('User unblocked successfully');
    } catch (error: any) {
      console.error('Failed to unblock user:', error);
      toast.error(error.message || 'Failed to unblock user');
    }
  };

  if (isAdminLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Verifying admin access...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAdminError || !isAdmin) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            {isAdminError
              ? `Error: ${adminError?.message || 'Failed to verify admin status'}`
              : 'You do not have admin privileges to access this panel.'}
          </AlertDescription>
        </Alert>
        <div className="mt-4 flex gap-2">
          <Button onClick={() => refetchAdminStatus()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">Manage users, settings, and monitor app metrics</p>
        </div>
        <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">
          <ShieldCheck className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Installs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{metricsLoading ? '...' : totalInstalls}</div>
              <Download className="w-8 h-8 text-emerald-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{overviewLoading ? '...' : totalUserCount}</div>
              <Users className="w-8 h-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Live Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{overviewLoading ? '...' : activeUsersCount}</div>
              <Activity className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Blocked Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{metricsLoading ? '...' : blockedCount}</div>
              <Ban className="w-8 h-8 text-red-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Management
          </CardTitle>
          <CardDescription>View and manage all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          {overviewLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : overviewError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Users</AlertTitle>
              <AlertDescription>
                {overviewErrorObj?.message || 'Failed to load user overview'}
              </AlertDescription>
            </Alert>
          ) : !overview || overview.userProfiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users registered yet
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Principal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overview.userProfiles.map(([principal, profile]) => {
                    const principalStr = principal.toString();
                    const session = overview.sessions.find(([p]) => p.toString() === principalStr);
                    const userStatus = overview.userStatuses.find(([p]) => p.toString() === principalStr)?.[1];
                    const isBlocked = userStatus === UserStatus.blocked;
                    const isCurrentUser = principalStr === callerPrincipal;

                    const now = BigInt(Date.now()) * BigInt(1_000_000);
                    const hasActiveSession = session && session[1].unlockExpiresAt > now;

                    return (
                      <TableRow key={principalStr}>
                        <TableCell className="font-medium">{profile.name}</TableCell>
                        <TableCell className="font-mono text-xs max-w-[200px] truncate">
                          {principalStr}
                        </TableCell>
                        <TableCell>
                          {isBlocked ? (
                            <Badge variant="destructive">
                              <ShieldX className="w-3 h-3 mr-1" />
                              Blocked
                            </Badge>
                          ) : (
                            <Badge variant="default" className="bg-emerald-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {hasActiveSession ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Connected
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isCurrentUser ? (
                            <Badge variant="secondary">You</Badge>
                          ) : isBlocked ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnblockUser(principal)}
                              disabled={unblockUser.isPending}
                            >
                              {unblockUser.isPending ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Unblock
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleBlockUser(principal)}
                              disabled={blockUser.isPending}
                            >
                              {blockUser.isPending ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <Ban className="w-3 h-3 mr-1" />
                                  Block
                                </>
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AdMob Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            AdMob Configuration
          </CardTitle>
          <CardDescription>Configure AdMob IDs for production ad serving</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {adMobConfigLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : adMobConfigError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading AdMob Config</AlertTitle>
              <AlertDescription>
                {adMobConfigErrorObj?.message || 'Failed to load AdMob configuration'}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="appId">AdMob App ID</Label>
                <Input
                  id="appId"
                  placeholder="ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Your AdMob application ID (found in AdMob console)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rewardedAdUnitId">Rewarded Ad Unit ID</Label>
                <Input
                  id="rewardedAdUnitId"
                  placeholder="ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ"
                  value={rewardedAdUnitId}
                  onChange={(e) => setRewardedAdUnitId(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Your rewarded ad unit ID for VPN unlock ads
                </p>
              </div>

              <Button
                onClick={handleSaveAdMobConfig}
                disabled={setAdMobConfig.isPending || !appId.trim() || !rewardedAdUnitId.trim()}
                className="w-full"
              >
                {setAdMobConfig.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save AdMob Configuration
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            App Logo
          </CardTitle>
          <CardDescription>Upload a custom logo for your app (recommended: 512x512px)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {logoLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {currentLogo && (
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <img
                    src={currentLogo.file.getDirectURL()}
                    alt="Current Logo"
                    className="w-16 h-16 rounded-lg object-cover border-2 border-border"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Current Logo</p>
                    <p className="text-xs text-muted-foreground">{currentLogo.mediaType}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="logo">Upload New Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                />
              </div>

              {logoPreview && (
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-16 h-16 rounded-lg object-cover border-2 border-border"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Preview</p>
                    <p className="text-xs text-muted-foreground">{logoFile?.name}</p>
                  </div>
                </div>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uploading...</span>
                    <span className="font-medium">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleUploadLogo}
                disabled={!logoFile || uploadLogo.isPending || uploadProgress > 0}
                className="w-full"
              >
                {uploadLogo.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
