pragma solidity ^0.4.21;


import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "FabricStructLib.sol";

contract ContractTypeHolder is Ownable {

    constructor() public Ownable(){
        owner=msg.sender;
        newestVersion=0;
    }

    FabricStructLib.SingleContractData[] private creators;

    uint64 private newestVersion;

    function updateCreator(address anotherCreator,string creatorName) public onlyOwner {
        iCreator crt = iCreator(anotherCreator);
        uint64 _creatorVersion=crt.getVersion();
        require(_creatorVersion>newestVersion/*,'iCreator is too old, try newer one'*/);
        crt.setHolder(this);
        FabricStructLib.SingleContractData tmp = FabricStructLib.SingleContractData(crt,creatorname);
        creators[_creatorVersion]=tmp;
        newestVersion=_creatorVersion;
    }


    function getCreator(uint64 version) public view  returns (address _creator, string creatorName){
        require(version<=newestVersion/*,'no creator for that version, it\'s unimplemented yet'*/);
        _creator = creators[version].contract;
        creatorName= creators[version].contractClass;
    }

    function getLatestCreator() public view returns (address _creator, string creatorName){
        (_creator,creatorname) =getCreator(newestVersion);
    }

}
