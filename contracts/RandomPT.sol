pragma solidity 0.7.2;
import "./Ownable.sol";
import "./provableAPI.sol";
contract RandomPT is Ownable, usingProvable{
    uint256 constant NUM_RANDOM_BYTES_REQUESTED = 1;
    uint256 public latestNumber;
    bytes32 queryId;
    struct Bet {
        address payable player;
        uint value;
        bool result;
    }

    mapping(bytes32 => Bet) public betting;
    mapping(address => bool) public waiting;

    event LogNewProvableQuery(string description);
    event generatedRandomNumber(uint256 randomNumber);
    event betTaken(address indexed player, bytes32 Id, uint value, bool result);

    event wager(address user, bytes32 queryId, uint value);
    event funded(address owner, uint funding);

    constructor() public {
        provable_setProof(proofType_Ledger);
    }

    function __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public override{
        require(msg.sender == provable_cbAddress());

        uint256 randomNumber = uint256(keccak256(abi.encodePacked(_result))) % 2;
        latestNumber = randomNumber;

        if(randomNumber == 0){
            betting[_queryId].result = false;
        }else if(randomNumber == 1){
            betting[_queryId].result = true;
            betting[_queryId].player.transfer((betting[_queryId].value) * 2);
        }
        emit generatedRandomNumber(randomNumber);
        emit betTaken(betting[_queryId].player, _queryId, betting[_queryId].value, betting[_queryId].result);
    }

    function update() payable public {
        uint256 QUERY_EXECUTION_DELAY = 0;
        uint256 GAS_FOR_CALLBACK = 2000000;
        require(waiting[msg.sender] == false);
        waiting[msg.sender] = true;
        
        queryId = provable_newRandomDSQuery(
            QUERY_EXECUTION_DELAY,
            NUM_RANDOM_BYTES_REQUESTED,
            GAS_FOR_CALLBACK
        );
        betting[queryId] = Bet({player: msg.sender, value: msg.value, result: false});
        emit LogNewProvableQuery("Provable query was sent, standing by for the answer");
        emit wager(msg.sender, queryId, msg.value);
        waiting[msg.sender] = false;
    }

    modifier costs(uint cost){
        require(msg.value >= cost);
        _;
    }

    function getBalance() public returns (uint) {
        return address(this).balance;
    }

     function fundContract() public payable costs(0.00001 ether) returns(uint) {
        require(msg.value != 0);
        
        emit funded(msg.sender, msg.value);
        return msg.value;
    }

    function withdrawBalance() public onlyOwner returns (uint) {
        msg.sender.transfer(address(this).balance);
        assert(address(this).balance == 0);
        return address(this).balance;
    }
}
