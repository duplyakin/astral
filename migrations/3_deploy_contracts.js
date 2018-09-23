var fs = require('fs');
var console =require('console')

function getAbi(filename){
  var tokenAbi=fs.readFileSync(filename, 'utf8');
  var obj =JSON.stringify(JSON.parse(tokenAbi).abi);
  console.log(obj.length+" "+obj);
  return obj;
}

module.exports = function(deployer, network, accounts) {


  var safeMath= artifacts.require("SafeMath");
/*  var zeppelinSolidity= artifacts.require("zeppelin-solidity");*/
  var BaseHolder = artifacts.require("BaseHolder");
  var icoBaseHolder = artifacts.require("BaseHolder");
  var iCreator = artifacts.require("iCreator");
  var iDocument = artifacts.require("iDocument");
  var SampleToken = artifacts.require("SampleToken");
  var SampleTokenCreator = artifacts.require("SampleTokenCreator");
  var SampleTokenBuilder = artifacts.require("SampleTokenBuilder");
  var myStorage = artifacts.require("Storage");
  var iVersionable=artifacts.require("iVersionable");
  var IncreasingPriceCrowdsaleBuilder=artifacts.require("IncreasingPriceCrowdsaleBuilder");
  var IncreasingPriceCrowdsaleCreator=artifacts.require("IncreasingPriceCrowdsaleCreator");
  var IncreasingPriceCrowdsale=artifacts.require("IncreasingPriceCrowdsale");
  deployer.deploy(safeMath);
  deployer.link(safeMath,[iVersionable,BaseHolder,myStorage]);
  deployer.deploy(myStorage);
  deployer.deploy(BaseHolder);

  var storage,holder;
  var stc;
  var tokenCreator, tokenBuilder,token;
  var icoHolder,icoCreator;
  deployer.then(function() {
  return myStorage.deployed();
}).then(function(instance) {
  storage = instance;
  console.log("myStorage");
  return BaseHolder.deployed();

}).then(function(instance) {
  holder = instance;
  console.error("BaseHolder");
  return  storage.addHolder("token",holder.address);

}).then(function() {
  //holder.address
  console.error("storage.addHolder");
  return SampleTokenCreator.new(holder.address,1, { from: accounts[0]});

}).then(function(instance) {

console.error("SampleTokenCreator.new");
  return SampleTokenCreator.at(instance.address);//Эксперимент: iCreator.at(instance.address)
}).then(function(instance) {
  console.error("iCreator from SampleTokenCreator");
  tokenCreator=instance;
  return holder.updateCreator(instance.address, { from: accounts[0]});
}).then(function() {
    console.error("holder.updateCreator");
  return  holder.updateAbi(1,getAbi('./build/contracts/SampleToken.json'), { from: accounts[0]});
}).then(function() {
    console.error("holder.updateAbi");
  return  tokenCreator.setBuilderAbi(getAbi('./build/contracts/SampleTokenBuilder.json'), { from: accounts[0]});
}).then(function() {
    console.error("tokenCreator.setBuilderAbi");
  return icoBaseHolder.new( { from: accounts[0]})
}).then(function(instance) {
    icoHolder= instance;
      console.error("icoBaseHolder.new");
    return  storage.addHolder("IncreasingPriceCrowdsale",icoHolder.address);
}).then(function() {
    console.error("storage.addHolder(IncreasingPriceCrowdsale");
  return    IncreasingPriceCrowdsaleCreator.new(icoHolder.address,1, { from: accounts[0]});
}).then(function(instance) {
  icoCreator=instance;
    console.error("IncreasingPriceCrowdsaleCreator.new");
    return icoHolder.updateCreator(instance.address, { from: accounts[0],gasLimit:2000000});
}).then(function() {
  console.error("icoHolder.updateCreator");
  return  icoHolder.updateAbi(1,getAbi('./build/contracts/IncreasingPriceCrowdsale.json'), { from: accounts[0],gasLimit:3000000});
}).then(function() {
  console.error("icoHolder.updateAbi");
  return  icoCreator.setBuilderAbi(getAbi('./build/contracts/IncreasingPriceCrowdsaleBuilder.json'), { from: accounts[0],gasLimit:3000000});
}).then(function(){

    console.error("tokenCreator.createDocumentBuilder ");
  return tokenCreator.createDocumentBuilder(accounts[1],{ from: accounts[0],gasLimit:30000000});
}).then(function(instance) {
  console.error(JSON.stringify(instance));
  var eventData;
  instance.logs.forEach(function(element){
    if(element.event==="ContractBuilderCreated"){
      eventData=element;
    }
  });
  if(eventData==null){
    console.error("Event not found!");
  }
  tokenBuilder=SampleTokenBuilder.at(eventData.args.newContract);
    console.error("tokenBuilder.setName");
  return tokenBuilder.setName("xxx",{ from: accounts[1],gasLimit:30000000});

}).then(function() {
    console.error("tokenBuilder.setSymbol");
  return tokenBuilder.setSymbol("yyy",{ from: accounts[1],gasLimit:30000000});

}).then(function(instance) {
    console.error(JSON.stringify(instance));
  console.error("tokenBuilder.setDecimals");
  return tokenBuilder.setDecimals(18,{ from: accounts[1],gasLimit:30000000});

}).then(function() {
console.error("tokenBuilder.build");
  return tokenBuilder.build({ from: accounts[1],gasLimit:30000000});
}).then(function(instance) {
    console.error(JSON.stringify(instance));
  var eventData;
  instance.logs.forEach(function(element){
    if(element.event==="FinalContractCreated"){
      eventData=element;
    }
  });
  if(eventData==null){
    console.error("Event FinalContractCreated not found!");
  }
  token=SampleToken.at(eventData.args.newContract);
  return token;
  console.log(instance);
}).then(function(instance) {
  console.log("want same contract");
  return instance.wantSameContract(accounts[0]);
}).then(function(instance) {
    console.error(JSON.stringify(instance));
  var eventData;
  instance.logs.forEach(function(element){
    if(element.event==="ContractBuilderCreated"){
      eventData=element;
    }
  });
  if(eventData==null){
    console.error("Event ContractBuilderCreated not found!");
  }

  console.log(instance);
});


/*.then(function(instance) {
  console.log("holder check:\n"+BaseHolder.address+"\n"+instance);
  console.log(JSON.stringify(instance));
  return BaseHolder.registerDocument(accounts[1],token.address,{ from: accounts[1],gasLimit:30000000});
})*//*.then(function(instance) {
  console.log(JSON.stringify(instance));
});*/



/*
deployer.then(function(instance) {
//  a = instance;
  //holder = instance;
  holder.updateCreator(instance.address);
  //return  storage.addHolder("token",holder.address);

}*/
/*  deployer.then(function(){
    return myStorage.new();
  })*/
//  deployer.deploy(SampleToken);
//  deployer.deploy(SampleTokenCreator);




};
