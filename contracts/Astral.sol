pragma solidity ^0.4.21;


import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";

contract iVersionable {
    function iVersionable(   iBaseHolder _holder, uint64 _version
    ) public {
        version = _version;
        holder = _holder;
      }

    uint64 public version;
    iBaseHolder public holder;

    function getVersion() public view returns (uint64 _version){
        _version=version;
    }
    function setVersion(uint64 _version) internal {
        version=_version;
    }
    function setHolder(iBaseHolder bh) public{
        holder = bh;
    }

    function getHolder() public view returns (iBaseHolder bh){
        bh=holder;
    }
}


contract iBaseHolder{
    function iBaseHolder()public {
        newestVersion=0;
    }

    mapping (uint64 => address) iCreators;
    mapping (uint64 => bytes) contractAbi;
    mapping (uint64 => mapping (address => address)) allDocuments;

    uint64 private newestVersion;
    function updateCreator(address anotherCreator) public {
        iCreator crt = iCreator(anotherCreator);
        uint64 _creatorVersion=crt.getVersion();
        require(_creatorVersion>newestVersion/*,'iCreator is too old, try newer one'*/);
        crt.setHolder(this);
        iCreators[_creatorVersion]=crt;
        newestVersion=_creatorVersion;
    }
    function updateAbi(uint64 version,bytes abi) public {

        contractAbi[version]=abi;

    }
    function getAbi(uint64 version) public view returns (bytes){

      return contractAbi[version];

    }

    function getCreator(uint64 version) public view  returns (iCreator _creator){
        require(version<=newestVersion/*,'no creator for that version, it\'s unimplemented yet'*/);
        _creator =iCreator( iCreators[version]);
    }

    function getLatestCreator() public view returns (iCreator _creator){
        _creator =getCreator(newestVersion);
    }

    function registerDocument(address _owner, address _document) public {
        iDocument document =iDocument(_document);
        uint64 _documentVersion=document.getVersion();
        //require (_documentVersion<=newestVersion/*,'document source unspecified!'*/);

        mapping (address => address) docsForVersion = allDocuments[_documentVersion];
      //  address docExists = docsForVersion[_owner];
      //  require(docExists==address(0),'document already created!');
        docsForVersion[_owner]=document;

    }

}

contract Storage is Ownable{
  function Storage() public Ownable(){
      owner=msg.sender;
  }
  mapping (uint256 => iBaseHolder) holdersByType;

  function getLatestCreatorVersion(string contractType)public view returns (uint){
    return holdersByType[ uint256(keccak256(contractType))].getLatestCreator().getVersion();
  }
  function getLatestCreator(string contractType) public view returns (iCreator _creator){
     return holdersByType[ uint256(keccak256(contractType))].getLatestCreator();
  }
  function addHolder(string contractType,iBaseHolder holder) public {
     holdersByType[uint256(keccak256(contractType))]=holder;
  }
}

// builder for contract.
contract iDocumentBuilder is Ownable {
  iCreator creator;
  bool isCreated;

  event FinalContractCreated(address _curator,address newContract, string newContractType);

  constructor  (address _curator, iCreator _creator)public{
  //  transferOwnership(_curator);
  isCreated = false;
    owner = _curator;
    creator= _creator;
  }

  modifier whileNotCreated(){
    require(isCreated == false);
       _;
  }

  modifier setCreatedOnSuccess(){
       _;
       isCreated=true;
  }
  /*modifier mustBeRegistered(){
    creator.getHolder().
    _;
  }*/

  function build() public onlyOwner whileNotCreated setCreatedOnSuccess returns (iDocument doc) {
    return new iDocument(owner, creator);
  }
}

// this class should be only one for contract version
contract iCreator is iVersionable, Ownable {
    event ContractBuilderCreated(address _curator,address newContract, string newContractType);
    bytes private builderAbi;

    function iCreator(iBaseHolder _holder,uint64 version)public iVersionable(_holder,version){
        owner = msg.sender;
    }

    function createDocumentBuilder(address _curator ) public returns (address _newDocumentBuilder) {
        _newDocumentBuilder = address(new iDocumentBuilder(_curator,this));
        emit ContractBuilderCreated(_curator,_newDocumentBuilder,"iDocumentBuilder");
    }
    function setBuilderAbi(bytes myabi) public {
      builderAbi=myabi;
    }
    function getDocumentBuilderAbi() public view returns (bytes myabi){

      return builderAbi;
    }
    function getDocumentAbi() public view returns (bytes myabi){
      myabi= holder.getAbi(getVersion());
    //  return abi;
    }
}

contract iDocument is iVersionable {
    address public  owner;

    function iDocument(address _owner, iCreator _creator) public iVersionable(_creator.getHolder(),1) {
      //  iCreator crt1232 = iCreator(_creator);
        owner=_owner;
    }

    function wantSameContract(  address _newOwner) public returns (address _newDoc) {
            _newDoc = createNewDoc(_newOwner);
    }

    function getOwner() public view returns  (address _owner){
        _owner=owner;
    }

///troubles)
    function createNewDoc(address _newOwner) internal returns (address _newDoc) {
       iBaseHolder holder = getHolder();
       iCreator creator = holder.getLatestCreator();
        _newDoc =creator.createDocumentBuilder(_newOwner/*,creator*/);
      //     holder.registerDocument(_newOwner, _newDoc); // не можем положим положить в holder пока не закончилась транзакция так как не знаем адрес нового контракта.
    }

    function register() public{
       holder.registerDocument(owner, this);
    }

}
