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
          console.log(crt);
          App.currentCrt = crt;

        var html = "";
        var abi = iCreator.abi;
          App.currentAbi=abi;
        for(var m in abi){
            if(abi[m]['type']=="function"){
              var inputs = abi[m]['inputs'];
              for(var inp in inputs){
                  html+=`<br><input type="text" id="`+abi[m]['name']+inputs[inp]['name']+`" placeholder="`+inputs[inp]['name']+`"></input>`;
              }
              html+=`<br><button onclick="App.runMethod('`+abi[m]['name']+`')">`+abi[m]['name']+`</button><br><br>`;
            }
          }
           creatordata.innerHTML=html;

          //creatordata.innerHTML = value.valueOf();
        //iCreator.address=value.address;
      //  return iCreator.at(value);
      }).catch(function(e) {
        console.log(e);
        self.setStatus("Error getting creator; see log.");
      });
    },
  runMethod:function(methodName){
    var crt=App.currentCrt;
    var abi=App.currentAbi;
  //  crt.defaults({from: web3.eth.defaultAccount});

    for(var m in abi){
        if(abi[m]['name']==methodName){
            console.log("OK!");
            var inputs = abi[m]['inputs'];
            var argslist =[/*methodName,crt*/] ;
            for(var inp in inputs){
              let rawval = document.getElementById(abi[m]['name']+inputs[inp]['name']).value;
              var convertedVal;
              switch (inputs[inp]['type']) {
                case "address":
                  convertedVal =Web3.utils.toChecksumAddress(rawval);
                  break;
                default:
                  convertedVal =rawval
              }
              argslist.push(convertedVal);
              //  html+=`<br><input type="text" id="`+abi[m]['name']+inputs[inp]['name']+`" placeholder="`+inputs[inp]['name']+`"></input>`;

            }
            argslist.push({from: web3.eth.defaultAccount, gasLimit:3000000});
              console.log(argslist);
                var result=   crt[methodName].apply( crt,argslist).then(function(res){
                console.log(result);
              });
            console.log(result);
          }
        }
  },
/*  wantSameContract: function() {
    var self = this;
    var meta;
    var kind = document.getElementById("newOwnerAddress").value;
    iDocument.deployed().then(function(instance) {
      meta = instance;
      return meta.wantSameContract.call(kind, {from: account});
    }).then(function(value) {
      var documentdata2 = document.getElementById("documentdata2");
        console.log(value);
      documentdata2.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error making the same contract for new owner; see log.");
    });
  },*/

/*  setName: function() {
    var self = this;
    var meta;
    var kind = document.getElementById("creatorname").value;
    MyStorage.deployed().then(function(instance){
      meta = instance;
      return meta.getLatestCreator.call(kind, {from: account});
    }).then(function(value) {
      return iCreator.at(value);
    }).then(function(instance) {
      meta = instance;
      return meta.createDocumentBuilder.call(account, {from: account});
    }).then(function(instance) {
      meta = instance;
      var kind = document.getElementById("name").value;
      return meta.setName.call(kind, {from: account});
    }).then(function() {
      return meta.getName.call({from: account});
    }).then(function(value) {
      var sampleTokenBuilder1 = document.getElementById("sampleTokenBuilder1");
        console.log(value);
      sampleTokenBuilder1.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error making the same contract for new owner; see log.");
    });
  },

  setSymbol: function() {
    var self = this;
    var meta;
    var kind = document.getElementById("symbol").value;
    SampleTokenBuilder.deployed().then(function(instance) {
      meta = instance;
      return meta.setSymbol.call(kind, {from: account});
    }).then(function(value) {
      var sampleTokenBuilder2 = document.getElementById("sampleTokenBuilder2");
        console.log(value);
      sampleTokenBuilder2.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error making the same contract for new owner; see log.");
    });
  },

  setDecimals: function() {
    var self = this;
    var meta;
    var kind = document.getElementById("decimals").value;
    SampleTokenBuilder.deployed().then(function(instance) {
      meta = instance;
      return meta.setDecimals.call(kind, {from: account});
    }).then(function(value) {
      var sampleTokenBuilder3 = document.getElementById("sampleTokenBuilder3");
        console.log(value);
      sampleTokenBuilder3.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error making the same contract for new owner; see log.");
    });
  },
*/
/*  setName: function() {
    var self = this;
    var meta;
    var kind = document.getElementById("token").value;
    iDocument.deployed().then(function(instance) {
      meta = instance;
      return meta.setToken.call(kind, {from: account});
    }).then(function(value) {
      var IncreasingPriceCrowdsaleBuilder1 = document.getElementById("IncreasingPriceCrowdsaleBuilder1");
        console.log(value);
      IncreasingPriceCrowdsaleBuilder1.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error making the same contract for new owner; see log.");
    });
  },

  setSymbol: function() {
    var self = this;
    var meta;
    var kind = document.getElementById("wallet").value;
    iDocument.deployed().then(function(instance) {
      meta = instance;
      return meta.setWallet.call(kind, {from: account});
    }).then(function(value) {
      var IncreasingPriceCrowdsaleBuilder2 = document.getElementById("IncreasingPriceCrowdsaleBuilder2");
        console.log(value);
      IncreasingPriceCrowdsaleBuilder2.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error making the same contract for new owner; see log.");
    });
  },

  setDecimals: function() {
    var self = this;
    var meta;
    var kind = document.getElementById("openingTime").value;
    iDocument.deployed().then(function(instance) {
      meta = instance;
      return meta.setOpeningTime.call(kind, {from: account});
    }).then(function(value) {
      var IncreasingPriceCrowdsaleBuilder3 = document.getElementById("IncreasingPriceCrowdsaleBuilder3");
        console.log(value);
      IncreasingPriceCrowdsaleBuilder3.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error making the same contract for new owner; see log.");
    });
  },
*/
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
    console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
  }
  web3.eth.getAccounts(function (error, accounts) {

    if (error) return console.error(error)
    console.log(accounts);
     web3.eth.accounts=accounts;
    web3.eth.defaultAccount = web3.eth.accounts[0];

  });
//window.web3.eth.
  App.start();
});
