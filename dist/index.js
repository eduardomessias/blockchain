"use strict";

var _cryptoJs = require("crypto-js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Block = /*#__PURE__*/function () {
  function Block(timestamp, data) {
    var previousHash = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    _classCallCheck(this, Block);

    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calcHash();
    this.nonce = 0;
  }

  _createClass(Block, [{
    key: "calcHash",
    value: function calcHash() {
      return (0, _cryptoJs.SHA256)(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
  }, {
    key: "isValid",
    value: function isValid() {
      return this.hash === this.calcHash();
    }
  }]);

  return Block;
}();

var Chain = /*#__PURE__*/function () {
  function Chain() {
    _classCallCheck(this, Chain);

    this.difficulty = 5;
    this.reward = 1;
    this.blocks = [this.createGenesisBlock()];
    this.pending = [];
  }

  _createClass(Chain, [{
    key: "createGenesisBlock",
    value: function createGenesisBlock() {
      return new Block(new Date(), "GENESIS", "0");
    }
  }, {
    key: "lastBlock",
    value: function lastBlock() {
      return this.blocks[this.blocks.length - 1];
    }
  }, {
    key: "addBlock",
    value: function addBlock(block) {
      block.previousHash = this.lastBlock().hash;
      this.mineBlock(block);
      this.blocks.push(block);
    }
  }, {
    key: "minePending",
    value: function minePending(rewardAddress) {
      var block = new TransBlock(Date.now(), this.pending, rewardAddress);
      this.mineBlock(block);
      console.log('New block successfully mined!');
      this.blocks.push(block);
      this.pending = [new Trans(null, rewardAddress, this.reward)];
    }
  }, {
    key: "createTransaction",
    value: function createTransaction(trans) {
      this.pending.push(trans);
    } // Proof-of-Work

  }, {
    key: "mineBlock",
    value: function mineBlock(block) {
      var blockHashDifficulty = block.hash.substring(0, this.difficulty);
      var difficultyArray = new Array(this.difficulty + 1).join('0'); // e.g:'00000'

      while (blockHashDifficulty !== difficultyArray) {
        block.nonce++;
        block.hash = block.calcHash();
        blockHashDifficulty = block.hash.substring(0, this.difficulty);
      }

      console.log("Block mined: " + block.hash);
    }
  }, {
    key: "isValidChain",
    value: function isValidChain() {
      for (var i = 1; i < this.blocks.length; i++) {
        var currentBlock = this.blocks[i];
        var previousBlock = this.blocks[i - 1];

        if (currentBlock.isValid() !== true) {
          return false;
        }

        if (currentBlock.previousHash !== previousBlock.hash) {
          return false;
        }
      }

      return true;
    }
  }]);

  return Chain;
}();

var Trans = /*#__PURE__*/_createClass(function Trans(from, to, amount) {
  _classCallCheck(this, Trans);

  this.from = from;
  this.to = to;
  this.amount = amount;
});

var TransBlock = /*#__PURE__*/function () {
  function TransBlock(timestamp, transactions) {
    var previousHash = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    _classCallCheck(this, TransBlock);

    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calcHash();
    this.nonce = 0;
  }

  _createClass(TransBlock, [{
    key: "calcHash",
    value: function calcHash() {
      return (0, _cryptoJs.SHA256)(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }
  }, {
    key: "isValid",
    value: function isValid() {
      return this.hash === this.calcHash();
    }
  }]);

  return TransBlock;
}();

module.exports = {
  Block: Block,
  Chain: Chain,
  Trans: Trans,
  TransBlock: TransBlock
};