// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

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

window.App = {
  start: function() {
    var self = this;

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
    getCreator: function() {
      var self = this;
      var meta;
      var kind = document.getElementById("creatorname").value;
      MyStorage.deployed().then(function(instance) {
        meta = instance;
        return meta.getLatestCreator.call(kind, {from: account});
      }).then(function(value) {
        var creatordata = document.getElementById("creatordata");
          console.log(value);
        creatordata.innerHTML = value.valueOf();
        //return iCreator.at(value);
      }).catch(function(e) {
        console.log(e);
        self.setStatus("Error getting creator; see log.");
      });
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

  setName: function() {
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
      return meta.sendCoin(receiver, amount, {from: account});
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
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.start();
});
