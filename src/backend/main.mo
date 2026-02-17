import Map "mo:core/Map";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Migrate state structure and restart actor on upgrade
(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type AppAdMobConfig = {
    appId : Text;
    rewardedAdUnitId : Text;
  };

  public type SessionInfo = {
    unlockExpiresAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  public type UserStatus = {
    #active;
    #blocked;
  };

  public type AppLogo = {
    mediaType : Text;
    file : Storage.ExternalBlob;
  };

  public type AppMetrics = {
    installs : Nat;
    activeCount : Nat;
    blockedCount : Nat;
  };

  // Add compare for sorting sessions
  module SessionInfo {
    public func compare(session1 : SessionInfo, session2 : SessionInfo) : Order.Order {
      Int.compare(session1.unlockExpiresAt, session2.unlockExpiresAt);
    };
  };

  public type UserOverview = {
    userProfiles : [(Principal, UserProfile)];
    sessions : [(Principal, SessionInfo)];
    userStatuses : [(Principal, UserStatus)];
  };

  var logo : ?AppLogo = null;
  var appAdMobConfig : ?AppAdMobConfig = null;
  var appMetrics : AppMetrics = {
    installs = 0;
    activeCount = 0;
    blockedCount = 0;
  };
  let sessions = Map.empty<Principal, SessionInfo>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userStatuses = Map.empty<Principal, UserStatus>();

  // Securely upgrade current principal to admin role
  public shared ({ caller }) func makeCurrentPrincipalAdmin(token : Text, userProvidedToken : Text) : async () {
    AccessControl.initialize(accessControlState, caller, token, userProvidedToken);
  };

  public query ({ caller }) func isCurrentPrincipalAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getLogo() : async ?AppLogo {
    logo;
  };

  public shared ({ caller }) func uploadLogo(newLogo : AppLogo) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can upload logos");
    };
    logo := ?newLogo;
  };

  // AdMob config management functions
  public query ({ caller }) func getAppAdMobConfig() : async ?AppAdMobConfig {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access AdMob config");
    };
    appAdMobConfig;
  };

  public query ({ caller }) func getAppAdMobConfigPublic() : async ?AppAdMobConfig {
    switch (appAdMobConfig) {
      case (?config) { ?config };
      case (null) { null };
    };
  };

  public shared ({ caller }) func setAppAdMobConfig(newConfig : AppAdMobConfig) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set AdMob config");
    };
    appAdMobConfig := ?newConfig;
  };

  // Update and retrieve metrics functions
  public shared ({ caller }) func incrementInstalls() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can increment installs");
    };
    switch (userStatuses.get(caller)) {
      case (? #blocked) {
        Runtime.trap("User is blocked and cannot increment installs");
      };
      case (_) {
        switch (userStatuses.get(caller)) {
          case (? #active) {
            Runtime.trap("User is already active, cannot increment installs");
          };
          case (_) {
            appMetrics := {
              appMetrics with
              installs = appMetrics.installs + 1;
              activeCount = appMetrics.activeCount + 1;
            };
            userStatuses.add(caller, #active);
          };
        };
      };
    };
  };

  public query ({ caller }) func getAppMetrics() : async AppMetrics {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access app metrics");
    };
    appMetrics;
  };

  // Session management functions
  public shared ({ caller }) func unlockSessions() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unlock sessions");
    };

    switch (userStatuses.get(caller)) {
      case (? #blocked) {
        Runtime.trap("User is blocked and cannot unlock sessions");
      };
      case (_) {
        let session = {
          unlockExpiresAt = Time.now() + 2 * 3600 * 1_000_000_000;
        };
        sessions.add(caller, session);
      };
    };
  };

  public query ({ caller }) func getSessions() : async SessionInfo {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch their sessions");
    };
    switch (sessions.get(caller)) {
      case (null) { Runtime.trap("Session does not exist") };
      case (?session) { session };
    };
  };

  public query ({ caller }) func getAllSessions() : async [SessionInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all sessions");
    };
    switch (sessions.isEmpty()) {
      case (true) { [] };
      case (false) {
        sessions.values().toArray().sort();
      };
    };
  };

  public shared ({ caller }) func clearSessions() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear sessions");
    };
    sessions.remove(caller);
  };

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserOverview() : async UserOverview {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view user overview");
    };

    {
      userProfiles = userProfiles.toArray();
      sessions = sessions.toArray();
      userStatuses = userStatuses.toArray();
    };
  };

  // New endpoint to block a user
  public shared ({ caller }) func blockUser(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can block users");
    };
    userStatuses.add(user, #blocked);
    appMetrics := {
      appMetrics with blockedCount = appMetrics.blockedCount + 1;
      activeCount = if (appMetrics.activeCount > 0) { appMetrics.activeCount - 1 } else { 0 };
    };
  };

  // New endpoint to unblock a user
  public shared ({ caller }) func unblockUser(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can unblock users");
    };
    userStatuses.remove(user);
    appMetrics := {
      appMetrics with
      activeCount = appMetrics.activeCount + 1;
      blockedCount = if (appMetrics.blockedCount > 0) { appMetrics.blockedCount - 1 } else { 0 };
    };
  };

  // Check if a user is blocked - admin only to prevent privacy leaks
  public query ({ caller }) func isUserBlocked(user : Principal) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can check user block status");
    };
    switch (userStatuses.get(user)) {
      case (? #blocked) { true };
      case (_) { false };
    };
  };
};

