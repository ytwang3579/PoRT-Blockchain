
const assert = require('assert')
const bs58check = require('bs58check');

const Wallet = require('./wallet');

var prk = 'd756e19af3303ea489eb5a8c5a44ac10a38317fc7ee85ec599bf158232601aa8' //secureRandom.randomBuffer(32)
var puk = '04f586957689dd425776cb9dabf6c8fa5b311a175ede33e1e85b54c931b6d8fb14f8085a1b095e6886a25bbe346da08eb05e605f100e67272da7dac4d4c43d60bc'
const path1 = 'm/123'
const path2 = 'm/123/12'
const path3 = 'm/123/12/1'

const wallet = new Wallet(prk, puk);

wallet.showInformation()

const publicKeyBefore = wallet.publicKey.toString('hex');

const child = wallet.derive(path1)
assert.equal(wallet.publicKey.toString('hex'), publicKeyBefore)
child.showInformation()

const child2 = wallet.derive(path2)
child2.showInformation()

const child3 = wallet.derive(path3)
child3.showInformation()

tx = wallet.createTransaction('asdf', '1DVi9TDKYwtL5jDdepaqUaN7Dj4ZBht7gN', 0.2)
console.log(tx)