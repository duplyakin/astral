pragma solidity ^0.4.21;


import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";


contract AbiHolder is Ownable {

  mapping (uint256 => bytes) private fileAbis;

  constructor() public Ownable(){
      owner=msg.sender;
  }

  function getAbi(string contractClass) public view  returns (bytes) {
    return fileAbis[ uint256(keccak256(contractClass))];
  }

  function setAbi(string contractClass, bytes abi)  public onlyOwner {
    fileAbis[ uint256(keccak256(contractClass))]=abi;
  }
}
