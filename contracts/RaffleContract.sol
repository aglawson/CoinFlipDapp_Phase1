import"./Ownable.sol";
import"./provableAPI.sol";

pragma solidity 0.5.12;

contract RaffleContract is Ownable, usingProvable {
    //* Variable Declaration */
    uint256 constant NUM_RANDOM_BYTES_REQUESTED = 1;
    bytes32 queryId;
    struct Bet {
        address payable player;
        uint value;
        bool result;
        // uint timePlaced;                                 
    }
    //* Events */
    event betTaken(address indexed player, bytes32 Id, uint value, bool result);
    event betPlaced(address indexed player,bytes32 queryId, uint value);
    event contractFunded(address contractOwner, uint funding);
    event LogNewProvableQuery(string description);
    event generatedRandomNumber(uint256 randomNumber);
    //* Mappings */
    mapping (bytes32 => Bet) public betting;            
    mapping (address => bool) public waiting;  
    // mapping (address => uint256) public raffleParticipants;
    // uint256 numOfParticipants;

    // function setNumOfParticipants(uint256 _numOfParticipants) public {
    //     require(_numOfParticipants > 0 && _numOfParticipants < 256);
    //     numOfParticipants = _numOfParticipants;
    // }

    //* Constructor */
    constructor() public  {
        provable_setProof(proofType_Ledger);
        //flip();
    }

    //initialize participants into mapping
    // function initializeParticipants(address payable participant, numOfParticipants) internal {
    //     for(uint256 i = 0; i < numOfParticipants; i++){
    //         raffleParticipants[i] = participant[i];
    //     }
    // }

    //* Modifiers */
    modifier costs(uint cost){
        uint jackpot = address(this).balance / 2;
        require(msg.value <= jackpot, "Jackpot is the max bet you can make");   
        require(msg.value >= cost, "The minimum bet you can make is 0.01 Ether");
        _;
    }
    //* Functions - Setter */
    //Oracle Callback Function of the flip() function
    function __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public {
        require(msg.sender == provable_cbAddress());

        if (provable_randomDS_proofVerify__returnCode(_queryId, _result, _proof) != 0) {
            /*
             * @notice  The proof verification has failed! Handle this case
             *          however you see fit. --> Not sure what to do here.
            */
        }
        else {
        //Final result of random number creation (0-255 % 2 == 0 || 1)
        uint256 randomNumber = 255;
        randomNumber = uint256(keccak256(abi.encodePacked(_result))) % 2; //change to % numberOfParticipants
        //Condition decision: false == lose || true == win
        if(randomNumber == 0){
            betting[_queryId].result = false;
        }
        else if(randomNumber == 1){
            betting[_queryId].result = true;
            betting[_queryId].player.transfer((betting[_queryId].value)*2);
        }
        else if(randomNumber == 255) {
            // betting[_queryId].value = 0;
            waiting[betting[_queryId].player] = false;
            betting[_queryId].player.transfer((betting[_queryId].value));
        }
                                            //!!!!Write functionality to send prize to participant with number corresponding to randomNumber;!!!!
        //Player address is not on waiting any more and can play again
        waiting[betting[_queryId].player] = false;
        //Emit event to Blockchain log (PlayerAddress, BetId, BetAmount, Result)
        emit generatedRandomNumber(randomNumber);
        emit betTaken(betting[_queryId].player, _queryId, betting[_queryId].value, betting[_queryId].result);
       }
    }
    //Placing a bet and simulate coin flip 
    function flip() public payable costs(0.01 ether){
        //Condition that player has no ongoing bet transaction
        require(waiting[msg.sender] == false);
        //Player address gets into waiting mode => Player is not able to place an other bet in this time
        waiting[msg.sender] = true;

        uint256 QUERY_EXECUTION_DELAY = 0;      //config: execution delay (0 for no delay)
        uint256 GAS_FOR_CALLBACK = 200000;      //config: gas fee for calling __callback function (200000 is standard)
        //Calling oracle to make random number request
        queryId = provable_newRandomDSQuery(QUERY_EXECUTION_DELAY, NUM_RANDOM_BYTES_REQUESTED, GAS_FOR_CALLBACK);     //function to query a random number, it will call the __callback function
        
        // uint queryTime = now;

        //Initialize new Bet with player values and bind it to oracle queryId
        betting[queryId] = Bet({player: msg.sender, value: msg.value, result: false});
        //Emit Bet values as an event to Blockchain log 
        emit betPlaced(msg.sender, queryId, msg.value);
        //emit LogNewProvableQuery("Provable query was sent, standing by for answer...");
    }
    //Withdraw Funds - get Ether from contract
    function withdrawAll() public onlyOwner returns(uint){
        //Should require that no bet is prozess! Should wait and disalow all new bets!
        msg.sender.transfer(address(this).balance);
        assert(address(this).balance == 0);
        return address(this).balance;
    }
    //Fund the Contract - put Ether into contract
    function fundContract() public payable onlyOwner returns(uint){
        require(msg.value != 0);
        emit contractFunded(msg.sender, msg.value);
        return msg.value;
    }
    //* Functions - Getter */
    //Get balance of contract address
    function getContractBalance() public view returns (uint) {
        uint contractBalance = address(this).balance;
        return contractBalance;
    }

}