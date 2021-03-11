var web3 = new Web3(Web3.givenProvider);
var contractInstance;
var abi = [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "description",
          "type": "string"
        }
      ],
      "name": "LogNewProvableQuery",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "queryId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "betPlaced",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "Id",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "result",
          "type": "bool"
        }
      ],
      "name": "betTaken",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "contractOwner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "funding",
          "type": "uint256"
        }
      ],
      "name": "contractFunded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "randomNumber",
          "type": "uint256"
        }
      ],
      "name": "generatedRandomNumber",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "betting",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "player",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "result",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "waiting",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_myid",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "_result",
          "type": "string"
        }
      ],
      "name": "__callback",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_queryId",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "_result",
          "type": "string"
        },
        {
          "internalType": "bytes",
          "name": "_proof",
          "type": "bytes"
        }
      ],
      "name": "__callback",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "flip",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "withdrawAll",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "fundContract",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getContractBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];
  
$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
        contractInstance = new web3.eth.Contract(abi, "0xf125C324eb0b97E96be92C01d7Fc2f5Ad34274f0", {from: accounts[0]});
        console.log(contractInstance);
        
    });
    
    web3.eth.getBalance("0xf125C324eb0b97E96be92C01d7Fc2f5Ad34274f0").then(function(result){
        $("#jackpot_output").text(web3.utils.fromWei(result, "ether") + " Ether");
    });
    
    $("#flip_button").click(flipping);
    $("#fund_contract_button").click(fundContract);
    $("#withdraw_button").click(withdrawAll);
    
    
    //Event listener 3
    //contractInstance.events.generatedRandomNumber({})
    //    .on('data', event => console.log(event));
    
});

function flipping(){
    var bet = $("#bet_input").val();
    var config = {
        value: web3.utils.toWei(bet,"ether")
    }
    contractInstance.methods.flip().send({value: web3.utils.toWei(bet,"ether")})
    .on("transactionHash", function(hash){
        console.log(hash);
    })
    .on("confirmation", function(confirmationNr){
        console.log(confirmationNr);
    })
    .on("receipt", function(receipt){
        console.log(receipt);
        /*
        if(receipt.events.betTaken.returnValues[2] === false){
            alert("You lost " + bet + " Ether!");
        }
        else if(receipt.events.betTaken.returnValues[2] === true){
            alert("You won " + bet + " Ether!");
        }
        */
    })
    
    
    
/*  Event listener 2
    contractInstance.once('betTaken', {
        filter: {player: '0xf125C324eb0b97E96be92C01d7Fc2f5Ad34274f0'}, // for test: player and contract owner are the same
        fromBlock: 7097288
    }, function(error, event){ console.log(event); });
*/
   
    //Event listener 1
    var event = contractInstance.generatedRandomNumber({}, {fromBlock:9770959, toBlock: 'latest'})
   
    event.watch(function(error, result){
        if(!error){
           console.log("Block Number: " + result.blockNumber);
        }
    });
   
}


function fundContract(){
    var fund = $("#fund_input").val();
    var config = {
        value: web3.utils.toWei(fund,"ether")
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

function withdrawAll(){
    contractInstance.methods.withdrawAll().send();
}