/**
 * Google AdMob Configuration
 * 
 * IMPORTANT: Replace these placeholder values with your actual AdMob IDs
 * before deploying to production.
 * 
 * To get your AdMob IDs:
 * 1. Create an account at https://admob.google.com
 * 2. Create a new app in the AdMob console
 * 3. Create a Rewarded Ad Unit for your app
 * 4. Copy the App ID and Ad Unit ID here
 * 
 * NOTE: This web prototype simulates rewarded ads. Real AdMob integration
 * requires native Android implementation using the Google Mobile Ads SDK.
 * 
 * For production Android app:
 * - Install Google Mobile Ads SDK
 * - Configure AdMob in AndroidManifest.xml
 * - Implement rewarded ad loading and display logic
 * - Handle ad callbacks (onAdLoaded, onAdFailedToLoad, onUserEarnedReward)
 * 
 * Ad Revenue Optimization Tips:
 * - Use mediation to maximize fill rate and eCPM
 * - Enable ad filtering in AdMob console to block inappropriate content
 * - Set up ad categories and content ratings
 * - Monitor performance metrics regularly
 */

export const ADMOB_CONFIG = {
  /**
   * Your AdMob Application ID
   * Format: ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY
   * 
   * Replace with your actual App ID from AdMob console
   */
  APP_ID: 'ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY',

  /**
   * Rewarded Ad Unit ID
   * Format: ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
   * 
   * This ad unit is shown when users want to unlock VPN access
   * Replace with your actual Rewarded Ad Unit ID
   */
  REWARDED_AD_UNIT_ID: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',

  /**
   * Ad Settings
   */
  SETTINGS: {
    // Minimum ad duration in seconds (for simulation)
    MIN_AD_DURATION: 40,
    
    // Session unlock duration in hours
    UNLOCK_DURATION_HOURS: 2,
    
    // Enable test ads during development
    // Set to false for production
    TEST_MODE: true,
  },
};

/**
 * Content Filtering Guidelines:
 * 
 * To block inappropriate content and maximize revenue:
 * 
 * 1. In AdMob Console > Blocking Controls:
 *    - Enable "Sensitive categories" blocking
 *    - Block categories: Dating, Gambling, Politics, Religion, etc.
 *    - Set content rating to appropriate level
 * 
 * 2. Enable Ad Review Center:
 *    - Review and block specific advertisers
 *    - Block competitor ads
 * 
 * 3. Use Mediation:
 *    - Add multiple ad networks (Facebook, Unity, etc.)
 *    - Enable waterfall optimization
 *    - Set floor prices for premium inventory
 * 
 * 4. Optimize for High CPC:
 *    - Target high-value geographic regions
 *    - Use appropriate ad formats
 *    - Maintain high user engagement
 *    - Ensure ad viewability standards
 */
