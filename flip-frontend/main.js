var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
        contractInstance = new web3.eth.Contract(abi, "0x7f3B38277E575861795d49c94f0F618CB0FECbB9", {from: accounts[0]});
    });
    
    $("#flip_button").click(flip);
    $("#fund_contract_button").click(fundContract);
    $("#withdraw_button").click(withdrawBalance);

});


function flip(){
    var wager = $("#bet_input").val();
    var bet = "" + wager;
    
    contractInstance.methods.update().send({value: web3.utils.toWei(bet,"ether")})
    .on("transactionHash", function(hash){
        console.log(hash);
    })
    .on("confirmation", function(confirmationNr){
        console.log(confirmationNr);
    })
    .on("receipt", function(receipt){
        console.log(receipt);
    })

    var event = contractInstance.events.generatedRandomNumber({}, {fromBlock: 9764762, toBlock: 'latest'})

    event.watch(function(error, result){
        if(!error){
            console.log("block number: " + result.blockNumber);
        }
    });
}



function fundContract() {
    var addAmount = $("#fund_input").val();
    var amt = "" + addAmount;
    var config = {
        value: web3.utils.toWei(amt,"ether")
    }

    contractInstance.methods.fundContract().send({value: web3.utils.toWei(amt,"ether")})
    .on("transactionHash", function(hash){
        console.log(hash);
    })
    .on("confirmation", function(confirmationNr){
        console.log(confirmationNr);
    })
    .on("receipt", function(receipt){
        console.log(receipt);
    })
}

function withdrawBalance(){
    contractInstance.methods.withdrawBalance().send();
}