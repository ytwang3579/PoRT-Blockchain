
const Wallet = require('./wallet.js');

w = new Wallet();

privateKeys = []
publicKeys = []

for(var i = 3158; i < 3307; i++) {
    var kp = w.NewKeyPair();
    // console.log(kp[0].toString('hex'), kp[1].encode('hex'));
    privateKeys.push(kp[0]);
    publicKeys.push(kp[1]);
}