import { useState } from 'react';
import { useSessionStatus } from '../hooks/useSessionStatus';
import { useUnlockSession } from '../hooks/useUnlockSession';
import { useDisconnectSession } from '../hooks/useDisconnectSession';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useIsCurrentUserBlocked } from '../hooks/useUserBlocking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, Clock, Unlock, Power, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { formatTime } from '../utils/timeFormat';
import RewardedAdStubModal from './RewardedAdStubModal';

export default function VpnSessionPanel() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { sessionStatus, remainingSeconds, isActive, isExpired, isLoading } = useSessionStatus();
  const { data: isBlocked, isLoading: isBlockedLoading } = useIsCurrentUserBlocked();
  const unlockSession = useUnlockSession();
  const disconnectSession = useDisconnectSession();
  const [showAdModal, setShowAdModal] = useState(false);

  const handleUnlockClick = () => {
    if (isBlocked) {
      return; // Prevent opening modal if blocked
    }
    setShowAdModal(true);
  };

  const handleAdComplete = async () => {
    setShowAdModal(false);
    await unlockSession.mutateAsync();
  };

  const handleAdCancel = () => {
    setShowAdModal(false);
  };

  const handleDisconnect = async () => {
    await disconnectSession.mutateAsync();
  };

  if (isLoading || isBlockedLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading session status...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Blocked User State
  if (isBlocked) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="border-2 border-destructive/50 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
              <XCircle className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-3xl mb-2">Account Blocked</CardTitle>
            <CardDescription className="text-base">
              Your account has been blocked by an administrator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Restricted</AlertTitle>
              <AlertDescription>
                You cannot unlock VPN sessions at this time. If you believe this is an error, 
                please contact support for assistance.
              </AlertDescription>
            </Alert>

            {userProfile && (
              <p className="text-center text-sm text-muted-foreground">
                Account: {userProfile.name}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Locked State
  if (!isActive && !isExpired) {
    return (
      <>
        <div className="w-full max-w-2xl mx-auto">
          <Card className="border-2 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Unlock className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-3xl mb-2">VPN Access Locked</CardTitle>
              <CardDescription className="text-base">
                Watch a short ad to unlock 2 hours of secure VPN access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm">Secure encrypted connection</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm">2 hours of uninterrupted access</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm">High-speed stable connection</span>
                </div>
              </div>

              <Button
                onClick={handleUnlockClick}
                size="lg"
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                disabled={unlockSession.isPending}
              >
                {unlockSession.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Unlocking...
                  </>
                ) : (
                  <>
                    <Unlock className="w-5 h-5 mr-2" />
                    Watch Ad to Unlock
                  </>
                )}
              </Button>

              {userProfile && (
                <p className="text-center text-sm text-muted-foreground">
                  Welcome back, {userProfile.name}!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <RewardedAdStubModal
          open={showAdModal}
          onComplete={handleAdComplete}
          onCancel={handleAdCancel}
        />
      </>
    );
  }

  // Expired/Disconnected State
  if (isExpired || (!isActive && remainingSeconds === 0)) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="border-2 border-destructive/50 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
              <XCircle className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-3xl mb-2">Session Expired</CardTitle>
            <CardDescription className="text-base">
              Your VPN session has ended. Watch another ad to reconnect.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Your 2-hour access period has ended. Click below to start a new session.
              </p>
              <Badge variant="outline" className="text-base px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                00:00:00
              </Badge>
            </div>

            <Button
              onClick={handleUnlockClick}
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Unlock className="w-5 h-5 mr-2" />
              Watch Ad to Reconnect
            </Button>
          </CardContent>
        </Card>

        <RewardedAdStubModal
          open={showAdModal}
          onComplete={handleAdComplete}
          onCancel={handleAdCancel}
        />
      </div>
    );
  }

  // Active/Unlocked State
  const progressPercentage = ((7200 - remainingSeconds) / 7200) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-2 border-emerald-500/50 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg animate-pulse">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <CardTitle className="text-3xl mb-2">VPN Connected</CardTitle>
          <CardDescription className="text-base">
            Your secure connection is active
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-8 text-center border-2 border-emerald-200 dark:border-emerald-800">
            <p className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Time Remaining
            </p>
            <div className="text-6xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mb-4 tracking-tight">
              {formatTime(remainingSeconds)}
            </div>
            <Progress value={progressPercentage} className="h-3 mb-2" />
            <p className="text-xs text-muted-foreground">
              {Math.round(progressPercentage)}% elapsed
            </p>
          </div>

          <Separator />

          {/* Status Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Active
              </Badge>
              <Badge variant="outline">
                <Shield className="w-3 h-3 mr-1" />
                Encrypted
              </Badge>
            </div>
            {userProfile && (
              <span className="text-sm text-muted-foreground">{userProfile.name}</span>
            )}
          </div>

          {/* Disconnect Button */}
          <Button
            onClick={handleDisconnect}
            variant="destructive"
            size="lg"
            className="w-full h-12"
            disabled={disconnectSession.isPending}
          >
            {disconnectSession.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Disconnecting...
              </>
            ) : (
              <>
                <Power className="w-4 h-4 mr-2" />
                Disconnect
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your session will automatically disconnect when time expires
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
