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
  var iBaseHolder = artifacts.require("iBaseHolder");
  var icoBaseHolder = artifacts.require("iBaseHolder");
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
  deployer.link(safeMath,[iVersionable,iBaseHolder,myStorage]);
  deployer.deploy(myStorage);
  deployer.deploy(iBaseHolder);

  var storage,holder;
  var stc;
  var tokenCreator;
  var icoHolder,icoCreator;
  deployer.then(function() {
  return myStorage.deployed();
}).then(function(instance) {
  storage = instance;
  return iBaseHolder.deployed();

}).then(function(instance) {
  holder = instance;
  return  storage.addHolder("token",holder.address);

}).then(function() {
  //holder.address
  return SampleTokenCreator.new(holder.address,1, { from: accounts[0]});

}).then(function(instance) {
  tokenCreator=instance;
  return holder.updateCreator(instance.address, { from: accounts[0]});
}).then(function() {
  return  holder.updateAbi(1,getAbi('./build/contracts/SampleToken.json'), { from: accounts[0]});
}).then(function() {
  return  tokenCreator.setBuilderAbi(getAbi('./build/contracts/SampleTokenBuilder.json'), { from: accounts[0]});
}).then(function() {
  return icoBaseHolder.new( { from: accounts[0]})
}).then(function(instance) {
    icoHolder= instance;
    return  storage.addHolder("IncreasingPriceCrowdsale",icoHolder.address);
}).then(function() {
  return    IncreasingPriceCrowdsaleCreator.new(icoHolder.address,1, { from: accounts[0]});
}).then(function(instance) {
  icoCreator=instance;
    return icoHolder.updateCreator(instance.address, { from: accounts[0],gasLimit:2000000});
}).then(function() {
  return  icoHolder.updateAbi(1,getAbi('./build/contracts/IncreasingPriceCrowdsale.json'), { from: accounts[0],gasLimit:3000000});
}).then(function() {
  return  icoCreator.setBuilderAbi(getAbi('./build/contracts/IncreasingPriceCrowdsaleBuilder.json'), { from: accounts[0],gasLimit:3000000});
}).then(function(){
    console.error("Account " +accounts[1]);
  return tokenCreator.createDocumentBuilder(accounts[1],{ from: accounts[0],gasLimit:3000000});
}).then(function(instance) {
  console.log(instance);
});



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
