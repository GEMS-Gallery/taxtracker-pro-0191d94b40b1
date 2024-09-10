import Hash "mo:base/Hash";

import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";

actor {
  type TaxPayer = {
    tid: Nat;
    firstName: Text;
    lastName: Text;
    address: Text;
  };

  stable var taxpayersEntries : [(Nat, TaxPayer)] = [];
  var taxpayers = HashMap.HashMap<Nat, TaxPayer>(10, Nat.equal, Nat.hash);

  public func addTaxPayer(tid: Nat, firstName: Text, lastName: Text, address: Text) : async Result.Result<(), Text> {
    switch (taxpayers.get(tid)) {
      case (?_) { #err("TaxPayer with TID " # Nat.toText(tid) # " already exists") };
      case null {
        let newTaxPayer : TaxPayer = {
          tid = tid;
          firstName = firstName;
          lastName = lastName;
          address = address;
        };
        taxpayers.put(tid, newTaxPayer);
        #ok()
      };
    }
  };

  public query func getTaxPayer(tid: Nat) : async ?TaxPayer {
    taxpayers.get(tid)
  };

  public func updateTaxPayer(tid: Nat, firstName: Text, lastName: Text, address: Text) : async Result.Result<(), Text> {
    switch (taxpayers.get(tid)) {
      case (null) { #err("TaxPayer with TID " # Nat.toText(tid) # " not found") };
      case (?_) {
        let updatedTaxPayer : TaxPayer = {
          tid = tid;
          firstName = firstName;
          lastName = lastName;
          address = address;
        };
        taxpayers.put(tid, updatedTaxPayer);
        #ok()
      };
    }
  };

  public func deleteTaxPayer(tid: Nat) : async Result.Result<(), Text> {
    switch (taxpayers.remove(tid)) {
      case (null) { #err("TaxPayer with TID " # Nat.toText(tid) # " not found") };
      case (?_) { #ok() };
    }
  };

  public query func getAllTaxPayers() : async [TaxPayer] {
    Iter.toArray(taxpayers.vals())
  };

  public query func searchTaxPayer(tid: Nat) : async ?TaxPayer {
    taxpayers.get(tid)
  };

  system func preupgrade() {
    taxpayersEntries := Iter.toArray(taxpayers.entries());
  };

  system func postupgrade() {
    taxpayers := HashMap.fromIter<Nat, TaxPayer>(taxpayersEntries.vals(), 10, Nat.equal, Nat.hash);
    taxpayersEntries := [];
  };
}
