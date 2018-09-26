pragma solidity ^0.4.21;


import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";

contract BaseHolder is Ownable{
  constructor() public Ownable(){
      owner=msg.sender;
  }
  mapping (uint256 => BaseHolder) holdersByType;
mapping (address=>{type version user// bh list?})
  function getLatestCreatorVersion(string contractType)public view returns (uint){
    return holdersByType[ uint256(keccak256(contractType))].getLatestCreator().getVersion();
  }
  ///??????
  function getLatestCreator(string contractType) public view returns (iCreator _creator, bytes _abi){
     BaseHolder bh =  holdersByType[ uint256(keccak256(contractType))]
     _creator =bh.getLatestCreator();
     _abi =bh.getCreatorAbi();

  }

  function addHolder(string contractType,BaseHolder holder) public {
     holdersByType[uint256(keccak256(contractType))]=holder;
  }
}
