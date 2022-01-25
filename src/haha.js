fs = require('fs');
const { strict } = require('assert');
const Wallet = require('./wallet.js');

w = new Wallet();

privateKeys = []
publicKeys = []
data = ""

for(var i = 3158; i < 3307; i++) {
    var kp = w.NewKeyPair();
    while(kp[0].toString('hex').length < 64){
        kp = w.NewKeyPair();
    }
    //var kp = [1,2];
    //kp[0] = secureRandom.randomBuffer(32);
    //kp[1] = ecdsa.keyFromPrivate(kp[0].toString(16)).getPublic();
    // console.log(kp[0].toString('hex'), kp[1].encode('hex'));
    data = data + i.toString() + "," +  kp[0].toString('hex') + "," + kp[1].encode('hex') + "\n";
}



fs.writeFile('h0.txt', data, function (err) {
    if (err) return console.log(err);
  });