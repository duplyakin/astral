pragma solidity ^0.4.21;

library FabricStructLib {

  // We define a new struct datatype that will be used to

  // hold its data in the calling contract.
  struct SingleContractData{
    address contract;
    string contractClass;
  }
  struct AllUserDocsForVersion{

    SingleContractData[] contracts;
    SingleContractData[] builders;
  }
  
  }
