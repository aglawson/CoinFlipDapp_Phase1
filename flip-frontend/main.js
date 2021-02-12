var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
        contractInstance = new web3.eth.Contract(abi, "0x2c0A366D241561762DD48B71f7Ee26B4fCeB7215", {from: accounts[0]});
    });
    
    $("#flip_button").click(flip);
    $("#fund_contract_button").click(fundContract);
    $("#withdraw_button").click(withdrawBalance);
    $("#balance_button").click(getBalance);
});


function flip(){
    var wager = $("#bet_input").val();
    var bet = "" + wager;
    
    contractInstance.methods.placeBet().send({value: web3.utils.toWei(bet,"ether")})
    .on("transactionHash", function(hash){
        console.log(hash);
    })
    .on("confirmation", function(confirmationNr){
        console.log(confirmationNr);
    })
    .on("receipt", function(receipt){
        console.log(receipt);
        if(receipt.events.placeBet.returnValues[2] == false){
            alert("You lost" + wager + " Ether");
        }else if(receipt.events.placeBet.returnValues[2] == true){
            alert("You won " + wager + " Ether!");
        }
    })
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