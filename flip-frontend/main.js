var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
        contractInstance = new web3.eth.Contract(abi, "0xc9b839b8D91f9e222b8C167e4E57577CCC807958", {from: accounts[0]});
    });
    
    $("#flip_button").click(flip);
    $("#fund_contract_button").click(fundContract);
    $("#withdraw_button").click(withdrawBalance);
});

function flip(){
    var wager = $("#bet_input").val();
    // var config = {
    //     value: web3.utils.toWei(wager, "ether")
    // };
    contractInstance.methods.placeBet().send({value: web3.utils.toWei(wager,"ether")})
    .on("transactionHash", function(hash){
        console.log(hash);
    })
    .on("confirmation", function(confirmationNr){
        console.log(confirmationNr);
    })
    .on("receipt", function(receipt){
        console.log(receipt);
        if(receipt.events.placeBet.returnValues[2] === false){
            alert("You lost" + wager + " Ether");
        }else if(receipt.events.placeBet.returnValues[2] === true){
            alert("You won " + wager + " Ether!");
        }
    })
}

function fundContract() {
    var addAmount = $("#func_input").val();
    
    var config = {
        value: web3.utils.toWei(addAmount,"ether")
    }

    contractInstance.methods.fundContract().send(config)
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