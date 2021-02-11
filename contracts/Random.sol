pragma solidity 0.5.12;
import "./Ownable.sol";
contract Random is Ownable{

    uint public balance = address(this).balance;
    uint public winnings = 0;

    event wager(address user, uint amount, bool);
    event funded(address owner, uint funding);

    modifier costs(uint cost){
        require(msg.value >= cost);
        _;
    }

    function fundContract() public payable costs(0.00001 ether) returns(uint) {
        require(msg.value != 0);
        
        emit funded(msg.sender, msg.value);
        balance += msg.value;
        return msg.value;
    }
    
    function placeBet() public payable costs(0.001 ether) returns (bool){
        require(balance >= msg.value * 2, "Not enough funds in the contract");
        
        bool result;

        if((block.timestamp % 2) == 0) {
            result = true;
        }else if(block.timestamp % 2 == 1) {
            result = false;
        }
        emit wager(msg.sender, msg.value, result);
        if(result == true){
            msg.sender.transfer(msg.value * 2);
            winnings += msg.value * 2;
            balance -= msg.value * 2;
        }else {
            balance += msg.value;
        }
        emit wager(msg.sender, msg.value, result);
        return result;
    }

    function getBalance() public returns (uint) {
        return address(this).balance;
    }


    function withdrawBalance() public onlyOwner returns (uint) {
        msg.sender.transfer(address(this).balance);
        assert(address(this).balance == 0);
        return address(this).balance;
    }

    function seeWinnings() public returns (uint) {
        return winnings;
    }
}
