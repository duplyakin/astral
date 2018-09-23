pragma solidity ^0.4.21;
import "../node_modules/zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "../node_modules/zeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "../node_modules/zeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "./Astral.sol";


contract SampleToken is iDocument, MintableToken{

  function SampleToken(address _owner, iCreator _creator, string _name, string _symbol, uint256 _decimals ) public iDocument(_owner,_creator){
        setVersion(2);
        name = _name;
        symbol = _symbol;
        decimals= _decimals;
  }
  string public name;
  string public symbol;
  uint256 public decimals;

}


contract SampleTokenBuilder is iDocumentBuilder{

  string internal name;
  string internal symbol;
  uint256 internal decimals;

  //event SampleTokenCreated(address _curator,address token);
  function SampleTokenBuilder  (address _curator, iCreator _creator) public iDocumentBuilder(_curator,_creator){
      owner = _curator;
  }

  function getName()  onlyOwner public view returns (string){
    return name;
  }
  function getSymbol()  onlyOwner public view returns (string){
    return symbol;
  }
  function getDecimals()  onlyOwner public view returns (uint256){
    return decimals;
  }
  function setName(string _name) onlyOwner whileNotCreated public{
    name=_name;
  }
  function setSymbol(string _symbol) onlyOwner whileNotCreated public{
    symbol=_symbol;
  }
  function setDecimals(uint256 _decimals) onlyOwner whileNotCreated public{
    decimals=_decimals;
  }
  function build() public onlyOwner whileNotCreated setCreatedOnSuccess returns (iDocument _doc) {
    require(bytes(name).length>0 && bytes(symbol).length>0 && decimals>0);
    SampleToken tok = new SampleToken(owner,creator,name, symbol,decimals);
    _doc= tok;
    emit FinalContractCreated(owner,tok,"SampleToken");

  }
}

contract SampleTokenCreator is iCreator{
  //  address lastbuilder private;
    function SampleTokenCreator(BaseHolder _holder, uint64 _version) public iCreator(_holder, _version) {
    }

  //  event SampleTokenBuilderCreated(address _curator,address builder);

    function createDocumentBuilder (address _curator/*,iCreator creator*/) public returns (address _newDocumentBuilder) {
        address lastbuilder  = new SampleTokenBuilder(_curator,this);
        emit  ContractBuilderCreated(_curator,lastbuilder,"SampleTokenBuilder");
        _newDocumentBuilder= lastbuilder;

    }
}






contract IncreasingPriceCrowdsale is Ownable ,iDocument,TimedCrowdsale {
 using SafeMath for uint256;


 uint256[]  public rates ;
 /**
  * @dev Constructor, takes intial and final rates of tokens received per wei contributed.
    */
 function IncreasingPriceCrowdsale(address _owner, iCreator _creator,uint256 _openingTime,uint256 _closingTime,uint256[] _rates,address _wallet, ERC20 _token) public iDocument(_owner,_creator) TimedCrowdsale(_openingTime,_closingTime) Crowdsale(1,  _wallet,  _token){
   owner = _owner;
    rates = _rates;
 }

 /**
  * @dev Returns the rate of tokens per wei at the present time.
  * Note that, as price _increases_ with time, the rate _decreases_.
  * @return The number of tokens a buyer gets per wei at a given time
  */
 function getCurrentRate() public view returns (uint256) {
   uint256 elapsedTime = now.sub(openingTime);
   uint256 weekNumber = elapsedTime.div(60*60*24*7);
   require(weekNumber < rates.length);
   return rates[weekNumber];
 }

 /**
  * @dev Overrides parent method taking into account variable rate.
  * @param _weiAmount The value in wei to be converted into tokens
  * @return The number of tokens _weiAmount wei will buy at present time
  */
 function _getTokenAmount(uint256 _weiAmount) internal view returns (uint256) {
   uint256 currentRate = getCurrentRate();
   return currentRate.mul(_weiAmount);
 }

}



contract IncreasingPriceCrowdsaleCreator is iCreator{

    function IncreasingPriceCrowdsaleCreator(BaseHolder _holder, uint64 _version) public iCreator(_holder, _version) {
    }

    function createDocumentBuilder (address _curator,iCreator creator) public  returns (address _newDocumentBuilder) {
        _newDocumentBuilder = new IncreasingPriceCrowdsaleBuilder(_curator,this);
        emit ContractBuilderCreated( _curator,_newDocumentBuilder, "IncreasingPriceCrowdsaleBuilder");
    }
}

contract IncreasingPriceCrowdsaleBuilder is iDocumentBuilder{

  ERC20 internal token;
  address internal wallet;
  uint256 internal openingTime;
//  uint256 internal closingTime;

  uint256[] rate;// index = week, value = rate;

  function resetRates() public onlyOwner whileNotCreated{
    rate.length=0;
  }
  function nextWeekRate(uint256 nwr) public onlyOwner whileNotCreated returns(uint256 _weekNumber) {
    _weekNumber=rate.push(nwr);
  }

  function getToken() constant onlyOwner public returns (ERC20){
    return token;
  }
  function getWallet() constant onlyOwner public returns (address){
    return wallet;
  }
  function getOpeningTime() constant onlyOwner public returns (uint256){
    return openingTime;
  }
  function getRates() constant onlyOwner public returns (uint256[]){
    return rate;
  }

  function setToken(ERC20 _token) onlyOwner whileNotCreated public{
    token=_token;
  }
  function setWallet(address _wallet) onlyOwner whileNotCreated public{
    wallet=_wallet;
  }
  function setOpeningTime(uint256 _openingTime) onlyOwner whileNotCreated public{
    openingTime=_openingTime;
  }


  function IncreasingPriceCrowdsaleBuilder  (address _curator, iCreator _creator) public iDocumentBuilder(_curator,_creator){

  }

  function build() public onlyOwner whileNotCreated setCreatedOnSuccess returns (iDocument _doc) {
    require(address(token)!=address(0));
    require(wallet!=address(0));
    require(rate.length>0);
    require(openingTime>now);
    uint256 closingTime = openingTime+(rate.length* 60*60*24*7);
    IncreasingPriceCrowdsale ipc= new IncreasingPriceCrowdsale(owner,creator,openingTime,closingTime,rate,wallet,token);
  //  ipc.setToken(token);
  //  ipc.setOpeningTime(openingTime);
  //  ipc.setRate(rate);
  //  ipc.setWallet(wallet);
    _doc=ipc;
    //creator.getHolder().registerDocument(owner,_doc);
  }
}
