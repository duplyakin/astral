// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";
// Import libraries we need.
var Web3 = require('web3');
import { default as contract } from 'truffle-contract'

//import coder from 'web3/lib/solidity/coder.js'
//import

// Import our contract artifacts and turn them into usable abstractions.
import metacoin_artifacts from '../../build/contracts/MetaCoin.json'
import myStorage_artifacts from '../../build/contracts/Storage.json'
import iBaseHolder_artifacts from '../../build/contracts/iBaseHolder.json'

import iCreator_artifacts from '../../build/contracts/iCreator.json'
/*import iDocumentBuilder_artifacts from '../../build/contracts/iDocumentBuilder.json'
import iDocument_artifacts from '../../build/contracts/iDocument.json'*/
import SampleToken_artifacts from '../../build/contracts/SampleToken.json'
import SampleTokenBuilder_artifacts from '../../build/contracts/SampleTokenBuilder.json'
import SampleTokenCreator_artifacts from '../../build/contracts/SampleTokenCreator.json'

import IncreasingPriceCrowdsale_artifacts from '../../build/contracts/IncreasingPriceCrowdsale.json'
import IncreasingPriceCrowdsaleBuilder_artifacts from '../../build/contracts/IncreasingPriceCrowdsaleBuilder.json'
import IncreasingPriceCrowdsaleCreator_artifacts from '../../build/contracts/IncreasingPriceCrowdsaleCreator.json'
// MetaCoin is our usable abstraction, which we'll use through the code below.
var MetaCoin = contract(metacoin_artifacts);
var MyStorage = contract(myStorage_artifacts);
var iBaseHolder = contract(iBaseHolder_artifacts);
var iCreator = contract(iCreator_artifacts);
/*var iDocumentBuilder = contract(iDocumentBuilder_artifacts);

var iDocument = contract(iDocument_artifacts);*/

var SampleToken = contract(SampleToken_artifacts);
var SampleTokenBuilder =  contract(SampleTokenBuilder_artifacts);
var SampleTokenCreator = contract(SampleTokenCreator_artifacts);

var IncreasingPriceCrowdsale = contract(IncreasingPriceCrowdsale_artifacts);
var IncreasingPriceCrowdsaleBuilder =  contract(IncreasingPriceCrowdsaleBuilder_artifacts);
var IncreasingPriceCrowdsaleCreator = contract(IncreasingPriceCrowdsaleCreator_artifacts);
// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

function getMethods(obj)
{
    var res = [];
    for(var m in obj) {
        if(typeof obj[m] == "function") {
            res.push(m)
        }
    }
    return res;
};

function generateElementId(functionname, contractAddress,varname){
  return functionname+contractAddress+varname;
}

function createMethodsForAnyContract(element,contract){
  var contractAddress=contract.options.address;
  window.App[contractAddress]=contract;
  var abi = contract.options.jsonInterface;
    var html = "";
    for(var m in abi){
        if(abi[m]['type']=="function"){
          var inputs = abi[m]['inputs'];
          for(var inp in inputs){
              html+=`<br><input type="text" id="`+generateElementId(abi[m]['name'],contractAddress,inputs[inp]['name'])+`" placeholder="`+inputs[inp]['name']+`"></input>`;
          }
          html+=`<br><button onclick="window.App.runMethod('`+contractAddress+`','`+abi[m]['name']+`')">`+abi[m]['name']+`</button><br><br>`;
        }
      }
       element.innerHTML=html;

      //creatordata.innerHTML = value.valueOf();
    //iCreator.address=value.address;
  //  return iCreator.at(value);

}


function createSpanForContract(element,contractAddress,contractObject){
  let span =  document.createElement('span');
  span.setAttribute('id',contractAddress);
//  document.body.insertBefore(element, span);
element.appendChild(span);
element.appendChild(document.createElement('hr'));

//document.body.insertBefore(element, document.createElement('hr'));
  return span;
}
function createSpanForCreator(element,contract){
  var span = createSpanForContract(element,contract.address,iCreator);
  var concreteContract = contract;

  window.App[contract.address]={
    createDocumentBuilder: function() {
      var self = this;
      var transaction;
      var BuilderAbi;
      var builderContract;
      var newContractOwner = document.getElementById(contract.address+"createDocumentBuilder_curator").value;
      concreteContract.createDocumentBuilder(newContractOwner,{from: web3.eth.defaultAccount, gasLimit:30000000})
      .then(function(dbi){
      //  console.log(JSON.stringify(dbi));
        transaction=dbi;/*!!!!!!!!*/

        console.error(JSON.stringify(transaction));
        var eventData;
        builderInstance.logs.forEach(function(element) {
          if(element.event==="IncreasingPriceCrowdsaleBuilderCreated"){
            eventData=element;
          }
            if(element.event==="CreatorBaseFired"){
              console.error("base function called!");
            }

        });
        if(eventData==null){
          console.error("Event not found!");
        }

        crowdsaleBuilder=IncreasingPriceCrowdsaleBuilder.at(eventData.args.builder);
          console.error("IncreasingPriceCrowdsaleBuilder.setName");

        return concreteContract.getDocumentBuilderAbi({from: web3.eth.defaultAccount, gasLimit:20000000});

      }).then(function(dba){
        let abiAsString = hexToString(dba);
        BuilderAbi=JSON.parse(abiAsString)
        builderContract = new web3.eth.Contract(JSON.parse(abiAsString),builderInstance,{from: web3.eth.defaultAccount});
      //  builderContract.
        createMethodsForAnyContract(span,builderContract);

      });
    },
    getDocumentBuilderAbi: function() {
      var self = this;
    },
    getDocumentAbi: function() {
      var self = this;
    }
 };
span.appendChild(document.createElement('br'));
//<input type="text" id="`+abi[m]['name']+contractAddress+inputs[inp]['name']+`" placeholder="`+inputs[inp]['name']+`"></input>`
//<br><label for="creatorversion">Version:</label><input type="text" id="version" placeholder="e.g., 95"></input>
 var iCurator = document.createElement('input');
 iCurator.setAttribute('id',contract.address+"createDocumentBuilder_curator");
 iCurator.setAttribute('type',"text");
 iCurator.setAttribute('placeholder',"Contract owner");
 span.appendChild(iCurator);
 span.appendChild(document.createElement('br'));
 var bCreateBuilder = document.createElement('button');
 bCreateBuilder.setAttribute('id',contract.address+"createDocumentBuilder");
 bCreateBuilder.setAttribute('onclick',"window.App[\""+contract.address+"\"].createDocumentBuilder()");
 bCreateBuilder.textContent="Create Document Builder";
 span.appendChild(bCreateBuilder);
 span.appendChild(document.createElement('br'));



/*
 span.appendChild(document.createElement('br'));
 span.appendChild(document.createElement('br'));
 var bGetBuilderAbi = document.createElement('button');
 bGetBuilderAbi.setAttribute('id',contract.address+"getDocumentBuilderAbi");
 bGetBuilderAbi.setAttribute('onclick',"window.App[\""+contract.address+"\"].getDocumentBuilderAbi()");
 bGetBuilderAbi.textContent="Document Builder Abi";

 span.appendChild(bGetBuilderAbi);
 span.appendChild(document.createElement('br'));
 span.appendChild(document.createElement('br'));
 var bGetDocumentAbi = document.createElement('button');
 bGetDocumentAbi.setAttribute('id',contract.address+"getDocumentAbi");
 bGetDocumentAbi.setAttribute('onclick',"window.App[\""+contract.address+"\"].getDocumentAbi()");
 bGetDocumentAbi.textContent="Document Abi";
 span.appendChild(bGetDocumentAbi);
 span.appendChild(document.createElement('br'));*/
}

function executeFunctionByName(functionName, context /*, args */) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
}

function hexToString (hex) {
    var string = '';
    for (var i = 2; i < hex.length; i += 2) {
      string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return string;
}

window.App = {
  start: function() {
    var self = this;
    console.warn(web3.eth.accounts);
  //  web3.eth.defaultAccount = web3.eth.accounts[0];
  //  web3.personal.unlockAccount(web3.eth.defaultAccount);
   if (typeof web3.currentProvider.sendAsync !== "function") {
        web3.currentProvider.sendAsync = function() {
        return web3.currentProvider.send.apply(
          web3.currentProvider, arguments
        );
      };
    }
    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider);
    MyStorage.setProvider(web3.currentProvider);
	  iBaseHolder.setProvider(web3.currentProvider);

	  iCreator.setProvider(web3.currentProvider);
    /*iDocumentBuilder.setProvider(web3.currentProvider)
    iDocument.setProvider(web3.currentProvider)*/

    SampleToken.setProvider(web3.currentProvider);
    SampleTokenBuilder.setProvider(web3.currentProvider);
    SampleTokenCreator.setProvider(web3.currentProvider);

    IncreasingPriceCrowdsale.setProvider(web3.currentProvider);
    IncreasingPriceCrowdsaleBuilder.setProvider(web3.currentProvider);
    IncreasingPriceCrowdsaleCreator.setProvider(web3.currentProvider);



},

  getCreator:function(){
    var self = this;
    var meta;
    var kind = document.getElementById("creatorname").value;
     var dep=MyStorage.deployed().then(function(instance) {
      meta = instance;
        console.log(meta);
      return meta.getLatestCreator.call(kind, {from: web3.eth.defaultAccount});
    }).then(function(value) {
      //iCreator.address=value.address;
      return iCreator.at(value);
    }).then(function(crt) {
      var creatordata = document.getElementById("creatordata");
    //    console.log(JSON.stringify(crt));
      //  App.currentCrt = crt;
      createSpanForCreator(creatordata,crt);

    });
  },

  runMethod:function(contractref,methodName){
    var crt = window.App[contractref];
    var abi= crt.options.jsonInterface;
  //  crt.defaults({from: web3.eth.defaultAccount});
    console.log(crt);
    for(var m in abi){
        if(abi[m]['name']==methodName){
            console.log("OK!");
            var inputs = abi[m]['inputs'];
            var argslist =[/*contractref*/] ;
            for(var inp in inputs){
              var elem = document.getElementById(generateElementId(abi[m]['name'],contractref,inputs[inp]['name']));
              let rawval = elem.value;
              var convertedVal;
              switch (inputs[inp]['type']) {
              /*  case "address":
                  convertedVal =Web3.utils.toChecksumAddress(rawval);
                  break;*/
                default:
                  convertedVal =rawval
              }
              argslist.push(convertedVal);
              //  html+=`<br><input type="text" id="`+abi[m]['name']+inputs[inp]['name']+`" placeholder="`+inputs[inp]['name']+`"></input>`;

            }
            crt.options.from= web3.eth.defaultAccount;
            crt.options.gasLimit= 20000000;


          //  argslist.push({from: web3.eth.defaultAccount, gasLimit:2000000});
              console.log("args :"+argslist);
              var to=   crt.methods[methodName];
              console.log("method :"+to);
              if(abi[m]["constant"]){
                /* argslist.push(function(err,res){
                    if(err!=null){
                      console.error(err);
                    }
                  console.log(res);
                });*/
                executeFunctionByName(methodName,crt.methods,...argslist).call().then(function (result)
                  {
                      console.log(result);
                  });
              }else{
                var txobj = executeFunctionByName(methodName,crt.methods,...argslist);
              //  txobj.from = web3.eth.defaultAccount;
                  txobj.send({from: web3.eth.defaultAccount},function(res){
                console.log(res);
              });
            }
          }
        }
  },


  sendCoin: function() {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: web3.eth.defaultAccount});
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:9545");
  }
  web3.eth.getAccounts(function (error, accounts) {

    if (error) return console.error(error)
    console.log(accounts);
     web3.eth.accounts=accounts;
    web3.eth.defaultAccount = web3.eth.accounts[0];
    let accountLabel = document.getElementById("accountLabel");
    let accTxt = accountLabel.innerHTML;
    accountLabel.innerHTML=accTxt+web3.eth.defaultAccount;
  });
//window.web3.eth.
  window.App.start();
});
