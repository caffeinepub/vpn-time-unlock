import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCurrentPrincipalAdmin, useGetAdminOverview } from '../hooks/useAdminPanel';
import { useGetAppAdMobConfig, useSetAppAdMobConfig } from '../hooks/useAppAdMobConfig';
import { useGetLogo, useUploadLogo } from '../hooks/useAppLogo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ShieldCheck, ShieldX, Users, AlertCircle, Save, Smartphone, Image as ImageIcon, Upload, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';

export default function AdminPanelPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading, isError: isAdminError, error: adminError, refetch: refetchAdminStatus } = useIsCurrentPrincipalAdmin();
  const { data: overview, isLoading: overviewLoading, isError: overviewError, error: overviewErrorObj, refetch: refetchOverview } = useGetAdminOverview();
  const { data: adMobConfig, isLoading: adMobConfigLoading, isError: adMobConfigError, error: adMobConfigErrorObj, refetch: refetchAdMobConfig } = useGetAppAdMobConfig();
  const { data: currentLogo, isLoading: logoLoading } = useGetLogo();
  const setAdMobConfig = useSetAppAdMobConfig();
  const uploadLogo = useUploadLogo();

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
      
      const externalBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await uploadLogo.mutateAsync({
        file: externalBlob,
        mediaType: logoFile.type,
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

  // Error state for admin status check
  if (isAdminError) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-destructive" />
              <div>
                <CardTitle className="text-2xl">Error Loading Admin Panel</CardTitle>
                <CardDescription>Failed to verify admin status</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>
                {adminError?.message || 'Unable to connect to the backend. Please check your connection and try again.'}
              </AlertDescription>
            </Alert>
            <Button onClick={() => refetchAdminStatus()} variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

      {/* Logo/Branding Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-primary" />
            <div>
              <CardTitle>App Logo</CardTitle>
              <CardDescription>Upload and manage your application logo</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {logoLoading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading logo...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Logo Preview */}
              {currentLogo && (
                <div className="space-y-2">
                  <Label>Current Logo</Label>
                  <div className="w-32 h-32 rounded-lg border-2 border-muted overflow-hidden bg-muted flex items-center justify-center">
                    <img
                      src={currentLogo.file.getDirectURL()}
                      alt="Current Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Upload New Logo */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logoFile">Upload New Logo</Label>
                  <Input
                    id="logoFile"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    disabled={uploadLogo.isPending}
                  />
                  <p className="text-xs text-muted-foreground">
                    Select an image file (PNG, JPG, SVG, etc.) to use as your app logo
                  </p>
                </div>

                {/* Preview Selected Logo */}
                {logoPreview && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="w-32 h-32 rounded-lg border-2 border-primary overflow-hidden bg-muted flex items-center justify-center">
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Uploading...</span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleUploadLogo}
                  disabled={!logoFile || uploadLogo.isPending}
                  className="min-w-32"
                >
                  {uploadLogo.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      {currentLogo ? 'Update Logo' : 'Upload Logo'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
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
          {adMobConfigError ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading AdMob Configuration</AlertTitle>
                <AlertDescription>
                  {adMobConfigErrorObj?.message || 'Failed to load AdMob settings. Please try again.'}
                </AlertDescription>
              </Alert>
              <Button onClick={() => refetchAdMobConfig()} variant="outline" className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Loading AdMob Config
              </Button>
            </div>
          ) : adMobConfigLoading ? (
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
                    Configuration saved and active
                  </p>
                )}
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Production Setup Required</AlertTitle>
                <AlertDescription className="text-xs">
                  These IDs are displayed in the simulated ad modal. For production Android apps,
                  integrate the Google Mobile Ads SDK following the documentation in{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">frontend/src/config/admob.ts</code>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users & Sessions Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <div>
              <CardTitle>Users & Sessions Overview</CardTitle>
              <CardDescription>View all registered users and their session status</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {overviewError ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading User Overview</AlertTitle>
                <AlertDescription>
                  {overviewErrorObj?.message || 'Failed to load user data. Please try again.'}
                </AlertDescription>
              </Alert>
              <Button onClick={() => refetchOverview()} variant="outline" className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Loading Users
              </Button>
            </div>
          ) : overviewLoading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading user overview...</p>
            </div>
          ) : !overview || (overview.userProfiles.length === 0 && overview.sessions.length === 0) ? (
            <div className="py-12 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No users or sessions yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Users will appear here once they log in and create profiles
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Principal ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Session Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overview.userProfiles.map(([principal, profile]) => {
                      const session = overview.sessions.find(([p]) => p.toString() === principal.toString());
                      const hasActiveSession = session && Number(session[1].unlockExpiresAt) > Date.now() * 1_000_000;

                      return (
                        <TableRow key={principal.toString()}>
                          <TableCell className="font-mono text-xs max-w-xs truncate">
                            {principal.toString()}
                          </TableCell>
                          <TableCell className="font-medium">{profile.name}</TableCell>
                          <TableCell>
                            {hasActiveSession ? (
                              <Badge variant="default" className="bg-emerald-500">
                                Active
                              </Badge>
                            ) : session ? (
                              <Badge variant="secondary">Expired</Badge>
                            ) : (
                              <Badge variant="outline">No Session</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total Users: {overview.userProfiles.length}</span>
                <span>Active Sessions: {overview.sessions.filter(([_, s]) => Number(s.unlockExpiresAt) > Date.now() * 1_000_000).length}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
