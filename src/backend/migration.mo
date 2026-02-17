import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldActor = {
    appAdMobConfig : ?{
      appId : Text;
      rewardedAdUnitId : Text;
    };
    sessions : Map.Map<Principal, { unlockExpiresAt : Int }>;
    userProfiles : Map.Map<Principal, { name : Text }>;
  };

  type NewActor = {
    appAdMobConfig : ?{
      appId : Text;
      rewardedAdUnitId : Text;
    };
    sessions : Map.Map<Principal, { unlockExpiresAt : Int }>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    logo : ?{ mediaType : Text; file : Storage.ExternalBlob };
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      logo = null
    };
  };
};
