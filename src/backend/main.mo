import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type FruitType = {
    #apple;
    #banana;
    #orange;
    #strawberry;
    #grapes;
    #peach;
    #pear;
    #plum;
  };

  public type ResultEntry = {
    timestamp : Int;
    fruit : FruitType;
    confidence : Nat;
    freshnessScore : Nat;
    freshnessConfidence : Nat;
  };

  public type UserProfile = {
    name : Text;
    // Additional user metadata if needed
  };

  module FruitType {
    public func toText(fruit : FruitType) : Text {
      switch (fruit) {
        case (#apple) { "Apple" };
        case (#banana) { "Banana" };
        case (#orange) { "Orange" };
        case (#strawberry) { "Strawberry" };
        case (#grapes) { "Grapes" };
        case (#peach) { "Peach" };
        case (#pear) { "Pear" };
        case (#plum) { "Plum" };
      };
    };
  };

  let resultStorage = Map.empty<Principal, List.List<ResultEntry>>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  func getListWithNewEntry(existingResults : ?List.List<ResultEntry>, newEntry : ResultEntry) : List.List<ResultEntry> {
    switch (existingResults) {
      case (null) {
        let newList = List.empty<ResultEntry>();
        newList.add(newEntry);
        newList;
      };
      case (?list) {
        list.add(newEntry);
        list;
      };
    };
  };

  public shared ({ caller }) func saveAnalysisResult(fruit : FruitType, confidence : Nat, freshnessScore : Nat, freshnessConfidence : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can store results");
    };

    let newEntry : ResultEntry = {
      timestamp = Time.now();
      fruit;
      confidence;
      freshnessScore;
      freshnessConfidence;
    };

    let updatedResults = getListWithNewEntry(resultStorage.get(caller), newEntry);
    resultStorage.add(caller, updatedResults);
  };

  public query ({ caller }) func getHistory() : async [ResultEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can fetch their history");
    };

    switch (resultStorage.get(caller)) {
      case (null) { [] };
      case (?results) { results.toArray() };
    };
  };
};
