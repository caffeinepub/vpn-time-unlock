import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldActor = {
    sessions : Map.Map<Principal, { unlockExpiresAt : Time.Time }>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    userStatuses : Map.Map<Principal, { #active; #blocked }>;
    logo : ?{
      mediaType : Text;
      file : Storage.ExternalBlob;
    };
    appAdMobConfig : ?{
      appId : Text;
      rewardedAdUnitId : Text;
    };
  };

  type NewActor = {
    sessions : Map.Map<Principal, { unlockExpiresAt : Time.Time }>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    userStatuses : Map.Map<Principal, { #active; #blocked }>;
    logo : ?{
      mediaType : Text;
      file : Storage.ExternalBlob;
    };
    appAdMobConfig : ?{
      appId : Text;
      rewardedAdUnitId : Text;
    };
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
