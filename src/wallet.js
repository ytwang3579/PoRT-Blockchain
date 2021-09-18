
const assert = require('assert')
const sha256 = require("sha256");
// const secureRandom = require('secure-random');
const elliptic = require('elliptic');
const ripemd160 = require('ripemd160');
const base58 = require('bs58');
// const BigInteger = require("bigi");
const secp256k1 = require('secp256k1');
// const bs58check = require('bs58check');
const ecdsa = new elliptic.ec('secp256k1');

const CHECKSUM_LENGTH = 4; // 4 bytes
const HARDENED_OFFSET = 0x80000000

const crypto = require('crypto');
// const { HDNode } = require("@ethersproject/hdnode");

const Transaction_MT = require("./transaction.js")

/**
 * Generate & Initialize Wallet Class
 * @class Wallet Class contains public-private key pair as well as its signing function for a wallet node
 * @constructor
 * @param  {string} [prik] - private key
 * @param  {string} [pubk] - public key
 */
function Wallet(prik='', pubk='') {
    
    if(prik == '' && pubk == '') {
        var keypair = this.NewKeyPair();
        this.privateKey = keypair[0];
        this.publicKey = keypair[1];
    } else if (prik != '' && pubk == '') {
        this.privateKey = prik;
        this.publicKey = Buffer.from(secp256k1.publicKeyCreate(Buffer.from(prik, 'hex'), true)).toString('hex');
    } else if (prik == '' && pubk != '') {
        throw new Error('This is a public key only-provided wallet');
    } else {
        
        if (prik.length == 64) {
            this.privateKey = prik;
        } else {
            throw new Error('Given private key is wrong format');
        }

        if (pubk.length == 130) {
            this.publicKey = Buffer.from(secp256k1.publicKeyCreate(Buffer.from(prik, 'hex'), true)).toString('hex');
        } else if (public.length == 66) {
            this.publicKey = pubk;
        } else {
            throw new Error('Given public key is wrong format');
        }
    }

    this.chainCode = crypto.randomBytes(32).toString('hex');
    this.depth = 0
    this.index = 0;

};

/**
 * Generate key pair when no parameters passed into wallet constructor
 */
Wallet.prototype.NewKeyPair = function(privateKey = crypto.randomBytes(32)) {
    // var privateKey = secureRandom.randomBuffer(32);
    
    const publicKey = Buffer.from(secp256k1.publicKeyCreate(privateKey, true));
    
    // var publicKey = keys.getPublic();
    return [privateKey.toString('hex'), publicKey.toString('hex')];
}

Wallet.prototype.PublicKeyFromHex = function(hex) {
    return ecdsa.keyFromPublic(hex, 'hex').getPublic();
}

/**
 * Generate the hash of public key
 * @return {string}  public key hash
 */
Wallet.prototype.PublicKeyHash = function() {
    let hash = sha256(Buffer.from(this.publicKey, 'hex'));

    let publicKeyHash = new ripemd160().update(Buffer.from(hash, 'hex')).digest();

    return publicKeyHash.toString('hex');
}

/**
 * Hash twice to generate checksum
 * @param  {string} versionedHash - bitcoin blockchain version byte + publickey hash
 * @return {string} checksum for address conversion
 */
Wallet.prototype.Checksum = function(versionedHash) {
    var firstHash = sha256(Buffer.from(versionedHash, 'hex'));
    var secondHash = sha256(Buffer.from(firstHash, 'hex'));
    secondHash = Buffer.from(secondHash, 'hex');
    return secondHash.subarray(0,CHECKSUM_LENGTH);

}

/**
 * Generate address from initial public key
 * @return {string}  base58 address
 */
Wallet.prototype.Address = function() {
    var pubHash = this.PublicKeyHash();
    var versionedHash = "00" + pubHash;
    var checksum = this.Checksum(versionedHash);
    var fullHash = versionedHash + checksum.toString('hex');
    
    return base58.encode(Buffer.from(fullHash,'hex'));
}

/**
 * Sign data for multisignature
 * @param  {string} dataHash - data to sign
 * @return {string} signature
 */
Wallet.prototype.Sign = function(dataHash) {
    const ecdsa = new elliptic.ec('secp256k1');
    let signature = ecdsa.sign(dataHash, privateKey, "hex", {canonical:true});
    return signature;
}

/**
 * Validate if the input address is valid
 * @param  {string} address - address to validate
 * @return {bool} True if the input address is valid; False otherwise
 */
Wallet.prototype.ValidateAddress = function(address) {
    var pubHash = base58.decode(address);
    var actualChecksum = pubHash.subarray(pubHash.length - CHECKSUM_LENGTH);
    var version = pubHash.subarray(0,1);
    var pubHash = pubHash.subarray(1,pubHash.length - CHECKSUM_LENGTH);
    var targetChecksum = this.Checksum(Buffer.concat([version, pubHash]));

    return (actualChecksum.compare(targetChecksum) == 0)

}

/**
 * Derive an instance according to the given path
 * @param  {string} path - absolute path for initializing instance
 * @return {Wallet} Return an wallet instance with key pairs
 */
Wallet.prototype.derive = function(path) {
    if (path === 'm' || path === 'M' || path === "m'" || path === "M'") {
        return this
    }

    var entries = path.split('/')

    var wallet = this

    entries.forEach(function(c, i) {

        if (i === 0) {
            assert(/^[mM]{1}/.test(c), 'Path must start with "m" or "M"')
            return
        }

        const isHardenPath = (c.length > 1) && (c[c.length - 1] === "'") 
        var index = parseInt(c, 10)

        assert(index < HARDENED_OFFSET, "Index is out of range for deriving a wallet")

        if (isHardenPath) {
            index += HARDENED_OFFSET
        }

        wallet = wallet.deriveChild(index)
    })

    return wallet
}

/**
 * Derive an new child node according to the index
 * @param  {integer} index - the index of the child node 
 * @return {Wallet} Return an child node instance with key pairs
 */
Wallet.prototype.deriveChild = function(index) {

    const isHardened = index > HARDENED_OFFSET
    const indexBuffer = Buffer.allocUnsafe(4)
    indexBuffer.writeUInt32BE(index, 0)

    var data 
    
    if (isHardened) {
        assert(this.privateKey, "Could not derive hardened child key since there is no existed private key")

        var sk = Buffer.from(this.privateKey, 'hex')
        var zb = Buffer.alloc(1, 0)
        sk = Buffer.concat([zb, sk])

        // 0x00 || ser256(kpar) || ser32(index)
        data = Buffer.concat([sk, indexBuffer])

    } else {
        assert(this.publicKey, "Could not derive hardened child key since there is no existed public key")

        // serP(Kpar) || ser32(index)
        data = Buffer.concat([Buffer.from(this.publicKey, 'hex'), indexBuffer])
    }

    var I = crypto.createHmac('sha512', Buffer.from(this.chainCode, 'hex')).update(data).digest()
    var IL = I.slice(0, 32)
    var IR = I.slice(32)

    var wallet = new Wallet()

    // Private parent key -> private child key
    if (this.privateKey) {
        try {
            wallet.privateKey = Buffer.from(secp256k1.privateKeyTweakAdd(Buffer.from(this.privateKey, 'hex'), IL)).toString('hex')
        } catch (err) {
            console.log('falied')
            return this.deriveChild(index + 1)
        }
    // Public parent key -> public child key
    } else {
        try {
            wallet.publicKey = Buffer.from(secp256k1.publicKeyTweakAdd(Buffer.from(this.publicKey, 'hex'), IR, true))
        } catch (err) {
            return this.deriveChild(index + 1)
        }
    }

    wallet.chainCode = IR.toString('hex')
    wallet.depth = this.depth + 1
    wallet.index = index

    return wallet
}

/**
 * Create a transaction
 * @param  {id} string - the identity of transaction
 * @param  {to} string - the address of receiver
 * @param  {value} string - value to transfer
 * @return {Wallet} Return a transaction object
 */
Wallet.prototype.createTransaction = function(id, to, value) {
    from = this.Address()
    
    tx = new Transaction_MT(id, from, to , value)

    return tx
}

/**
 * Show the wallet information
 */
Wallet.prototype.showInformation = function() {
    console.log('Private key: ' + this.privateKey)
    console.log('Public key : ' + this.publicKey)
    console.log('Chain code : ' + this.chainCode)
    console.log('Depth      : ' + this.depth)
    console.log('Index      : ' + this.index)
}

module.exports = Wallet;