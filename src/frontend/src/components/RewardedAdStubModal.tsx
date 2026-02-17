import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, X, CheckCircle2 } from 'lucide-react';
import { ADMOB_CONFIG } from '../config/admob';
import { useGetAppAdMobConfig } from '../hooks/useAppAdMobConfig';

interface RewardedAdStubModalProps {
  open: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

export default function RewardedAdStubModal({
  open,
  onComplete,
  onCancel,
}: RewardedAdStubModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [canClose, setCanClose] = useState(false);
  const { data: adMobConfig } = useGetAppAdMobConfig();

  const AD_DURATION = 40; // 40 seconds

  // Use saved config if available, otherwise fall back to placeholder
  const displayAppId = adMobConfig?.appId || ADMOB_CONFIG.APP_ID;
  const displayRewardedAdUnitId = adMobConfig?.rewardedAdUnitId || ADMOB_CONFIG.REWARDED_AD_UNIT_ID;

  useEffect(() => {
    if (!open) {
      setIsPlaying(false);
      setProgress(0);
      setCanClose(false);
      return;
    }
  }, [open]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / AD_DURATION);
        if (newProgress >= 100) {
          clearInterval(interval);
          setCanClose(true);
          return 100;
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleStart = () => {
    setIsPlaying(true);
  };

  const handleComplete = () => {
    onComplete();
  };

  const handleCancel = () => {
    if (!isPlaying || canClose) {
      onCancel();
    }
  };

  const remainingSeconds = Math.ceil((100 - progress) / (100 / AD_DURATION));

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Rewarded Video Ad</DialogTitle>
          <DialogDescription>
            Watch the full ad to unlock 2 hours of VPN access
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Ad Simulation Display */}
          <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
            {!isPlaying ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <p className="text-white text-sm">Click Start to begin</p>
              </div>
            ) : (
              <div className="text-center space-y-4 p-6">
                <div className="text-white text-lg font-semibold">
                  {canClose ? 'Ad Complete!' : 'Ad Playing...'}
                </div>
                {!canClose && (
                  <div className="text-white/80 text-sm">
                    Please wait {remainingSeconds} seconds
                  </div>
                )}
                {canClose && (
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                )}
              </div>
            )}

            {/* Ad Badge */}
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="text-xs">
                Ad
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          {isPlaying && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">
                {Math.round(progress)}% complete
              </p>
            </div>
          )}

          {/* AdMob Config Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-xs">
            <p className="font-semibold text-foreground">AdMob Configuration:</p>
            <p className="text-muted-foreground">
              <span className="font-medium">App ID:</span> {displayAppId}
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium">Rewarded Ad Unit:</span> {displayRewardedAdUnitId}
            </p>
            <p className="text-xs text-muted-foreground mt-2 italic">
              Note: This is a simulated ad for web prototype. Real AdMob integration requires native Android implementation.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isPlaying ? (
              <>
                <Button onClick={handleStart} className="flex-1" size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  Start Ad
                </Button>
                <Button onClick={handleCancel} variant="outline" size="lg">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : canClose ? (
              <Button onClick={handleComplete} className="flex-1" size="lg">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Claim Reward
              </Button>
            ) : (
              <Button disabled className="flex-1" size="lg">
                Please wait... ({remainingSeconds}s)
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
