import { SHA256 } from 'crypto-js'

class Block {
    constructor(timestamp, data, previousHash = '') {
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.hash = this.calcHash()
        this.nonce = 0
    }

    calcHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
    }

    isValid() {
        return this.hash === this.calcHash()
    }
}

class Chain {
    constructor() {
        this.difficulty = 5
        this.reward = 1
        this.blocks = [this.createGenesisBlock()]
        this.pending = []
    }

    createGenesisBlock() {
        return new Block(new Date(), "GENESIS", "0")
    }

    lastBlock() {
        return this.blocks[this.blocks.length - 1]
    }

    addBlock(block) {
        block.previousHash = this.lastBlock().hash
        this.mineBlock(block)
        this.blocks.push(block)
    }

    minePending(rewardAddress) {
        let block = new TransBlock(Date.now(), this.pending, rewardAddress)
        this.mineBlock(block)

        console.log('New block successfully mined!')
        this.blocks.push(block)

        this.pending = [new Trans(null, rewardAddress, this.reward)]
    }

    createTransaction(trans) {
        this.pending.push(trans)
    }

    // Proof-of-Work
    mineBlock(block) {
        let blockHashDifficulty = block.hash.substring(0, this.difficulty)
        const difficultyArray = new Array(this.difficulty + 1).join('0') // e.g:'00000'

        while (blockHashDifficulty !== difficultyArray) {
            block.nonce++
            block.hash = block.calcHash()

            blockHashDifficulty = block.hash.substring(0, this.difficulty)
        }

        console.log("Block mined: " + block.hash)
    }

    isValidChain() {
        for (let i = 1; i < this.blocks.length; i++) {
            const currentBlock = this.blocks[i]
            const previousBlock = this.blocks[i - 1]

            if (currentBlock.isValid() !== true) {
                return false
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false
            }
        }

        return true
    }
}

class Trans {
    constructor(from, to, amount) {
        this.from = from
        this.to = to
        this.amount = amount
    }
}

class TransBlock {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp
        this.transactions = transactions
        this.previousHash = previousHash
        this.hash = this.calcHash()
        this.nonce = 0
    }

    calcHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString()
    }

    isValid() {
        return this.hash === this.calcHash()
    }
}

module.exports = {
    Block,
    Chain,
    Trans,
    TransBlock
}