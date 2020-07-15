function Stake(address) {
    this.addresses = [
        "5aad9b5e21f63955e8840e8b954926c60e0e2d906fdbc0ce1e3afe249a67f614"
      ];
      this.balance = {
        "5aad9b5e21f63955e8840e8b954926c60e0e2d906fdbc0ce1e3afe249a67f614": 1000
      };
};

Stake.prototype.initialize = function(address) {
    if (this.balance[address] == undefined) {
      this.balance[address] = 0;
      this.addresses.push(address);
    }
}

  // transfer(from, to, amount) {
  //   this.initialize(from);
  //   this.initialize(to);
  //   this.increment(to, amount);
  //   this.decrement(from, amount);
  // }

  // increment(to, amount) {
  //   this.balance[to] += amount;
  // }

  // decrement(from, amount) {
  //   this.balance[from] -= amount;
  // }

Stake.prototype.addStake = function(from, amount) {
    this.initialize(from);
    this.balance[from] += amount;
}

Stake.prototype.getBalance = function(address) {
    this.initialize(address);
    return this.balance[address];
}

Stake.prototype.getMax = function(addresses) {
    let balance = -1;
    let leader = undefined;
    addresses.forEach(address => {
      if (this.getBalance(address) > balance) {
        leader = address;
      }
    });
    return leader;
  }

Stake.prototype.update = function(transaction) {
    let amount = transaction.output.amount;
    let from = transaction.input.from;
    this.addStake(from, amount);
}

module.exports = Stake;