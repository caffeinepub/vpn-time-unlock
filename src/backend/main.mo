import Map "mo:core/Map";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";



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

  module SessionInfo {
    public func compare(session1 : SessionInfo, session2 : SessionInfo) : Order.Order {
      Int.compare(session1.unlockExpiresAt, session2.unlockExpiresAt);
    };
  };

  public type UserOverview = {
    userProfiles : [(Principal, UserProfile)];
    sessions : [(Principal, SessionInfo)];
  };

  public type AppLogo = {
    mediaType : Text;
    file : Storage.ExternalBlob;
  };

  var logo : ?AppLogo = null;
  var appAdMobConfig : ?AppAdMobConfig = null;
  let sessions = Map.empty<Principal, SessionInfo>();
  let userProfiles = Map.empty<Principal, UserProfile>();

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

  public shared ({ caller }) func setAppAdMobConfig(newConfig : AppAdMobConfig) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set AdMob config");
    };
    appAdMobConfig := ?newConfig;
  };

  // Session management functions
  public shared ({ caller }) func unlockSessions() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unlock sessions");
    };
    let session = {
      unlockExpiresAt = Time.now() + 2 * 3600 * 1_000_000_000;
    };
    sessions.add(caller, session);
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
    };
  };
};
