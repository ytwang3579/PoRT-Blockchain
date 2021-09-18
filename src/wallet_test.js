
const args = process.argv.slice(2);

const assert = require('assert')
const bs58check = require('bs58check');

const Wallet = require('./wallet');

var prk = 'd756e19af3303ea489eb5a8c5a44ac10a38317fc7ee85ec599bf158232601aa8' //secureRandom.randomBuffer(32)
var puk = '04f586957689dd425776cb9dabf6c8fa5b311a175ede33e1e85b54c931b6d8fb14f8085a1b095e6886a25bbe346da08eb05e605f100e67272da7dac4d4c43d60bc'
const path1 = 'm/123'
const path2 = 'm/123/12'
const path3 = 'm/123/12/1'

var wallet = new Wallet(prk, puk);

// wallet.showInformation()

// var child = wallet.derive(path1)
// child.showInformation()

// var child2 = wallet.derive(path2)
// child2.showInformation()

// var child3 = wallet.derive(path3)
// child3.showInformation()


arguments_len = args.length

// test creating a wallet with random keys
if (args[0] == 'create_wallet') {

    // system generates random key pairs
    if (arguments_len === 1) {
        wallet = new Wallet(prk, puk)
        wallet.showInformation()

    // system creates a wallet with given private key
    } else if (arguments_len === 2) {
        privateKey = args[1]
        wallet = new Wallet(privateKey)
        wallet.showInformation()
    
    // system creates a wallet with given private key and public key
    } else if (arguments_len === 3) {
        privateKey = args[1]
        publicKey = args[2]
        wallet = new Wallet(privateKey, publicKey)
        wallet.showInformation()

    // system got extra arguments
    } else {
        throw new Error('[Error] There are more than 3 arguments!')
    }

// test deriving wallet by path
} else if (args[0] == 'derive_wallet') {

    if (arguments_len === 1) {
        wallet = new Wallet()
        child = wallet.derive(path1)
        child.showInformation()
    } else {
        path = args[1]
        var isValidPath = true

        entries = path.split('/')

        entries.forEach(function(c, i) {
            if (i > 0) {
                if ((/^\d+$/.test(c)) === false) {
                    isValidPath = false
                }
            }
        })

        if (isValidPath) {
            wallet = new Wallet()
            child = wallet.derive(path)
            child.showInformation()
        } else {
            throw new Error('[Error] Given path is not valid, which contains invalid character!')
        }
    }

// test creating transaction
} else if (args[0] == 'create_tx') {

    if (arguments_len === 4) {
        id = args[1]
        to = args[2]
        value = args[3]
        
        wallet = new Wallet()

        tx = wallet.createTransaction(id, to, value)

        console.log(tx)
    } else {
        throw new Error('[Error] There is no enough arguments to create a transaction!')
    }
}