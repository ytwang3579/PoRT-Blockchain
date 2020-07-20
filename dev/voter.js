/* 
 * CAUTION: NOT YET DEBUGGED
 */


function Voter(ID, GlobalMPT, CreatorMPT, TxPool) {
    this.CreatorMPT = CreatorMPT;
    this.GlobalMPT = GlobalMPT;
    this.TxPool = TxPool.get_transaction();
    this.ID = ID;
    this.Verify();
}

Voter.prototype.Verify = function(GlobalMPT) {
    if(this.ID < GlobalMPT.numOfAddress) {
        for(var i = 0; i < GlobalMPT.numOfAddress; i++) {
            if(GlobalMPT.account[i].address == this.ID) {
                if(GlobalMPT.account[i].voter_bit = 1) {
                    this.IsVoter = 1;
                } else {
                    this.IsVoter = 0;
                    break;
                }
            }
        }
    }
    if(this.IsVoter == null) {
        console.log("Error: ID does not match to MPT!\n");
    }
}


/*
 * Voting Function: 
 *                  Check whether status given from creator matches the global status
 */
Voter.prototype.Vote = function() {
    if(this.IsVoter != 1) {
        console.log("Error: Calling vote function without voter bit!\n");
        return false;
    }

    if(this.CreatorMPT.numOfAddress != this.GlobalMPT.numOfAddress) {
        return false;
    }

    for(var i = 0; i < this.GlobalMPT.numOfAddress; i++) {
        if(this.MPT_global.account[i].balance != this.MPT_from_creator.account[i].balance) {
            return false;
        }
    }

    for(var i = 0; i < this.TxPool.length; i++){
        for(var j = 0; j < this.CreatorMPT.numOfAddress; j++){
            if(this.TxPool[i].sender == this.CreatorMPT.account[j].address){
                var find = false;
                for(var tx = 0; tx < this.CreatorMPT.account[j].transactions.length; tx++) {
                    if(this.CreatorMPT.account[j].transactions[tx] == this.TxPool[i]) {
                        find = true;
                    }
                }
                if(find == false) {
                    return false;
                }
            }
            
            if(this.TxPool[i].receiver == this.CreatorMPT.account[j].address){
                var find = false;
                for(var tx = 0; tx < this.CreatorMPT.account[j].transactions.length; tx++) {
                    if(this.CreatorMPT.account[j].transactions[tx] == this.TxPool[i]) {
                        find = true;
                    }
                }
                if(find == false) {
                    return false;
                }
            }
        }        
    }

    return true;
}

module.exports = Voter;