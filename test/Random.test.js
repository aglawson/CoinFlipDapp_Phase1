const RandomPT = artifacts.require("RandomPT");
const truffleAssert = require("truffle-assertions");

contract("RandomPT", async function(accounts) {
    let instance;
    beforeEach(async function() {
        instance = await RandomPT.deployed();
    });

    it("should be able to accept a bet of sufficient value", async function() {
        await instance.fundContract({
        value: web3.utils.toWei("1", "ether"),        
        from: accounts[2]
    });
        instance.getBalance();
        await truffleAssert.passes(instance.placeBet({value: web3.utils.toWei("0.001", "ether"), from: accounts[1]}), truffleAssert.ErrorType.REVERT);
    });

    
    it("should not be able to accept a bet of insufficient value", async function() {
        await instance.fundContract({value: web3.utils.toWei("1", "ether"),        
        from: accounts[2]});
        instance.getBalance();
        await truffleAssert.fails(instance.placeBet({value: web3.utils.toWei("0.00001", "ether"), from: accounts[1]}), truffleAssert.ErrorType.REVERT);
    });

    it("should not be possible to bet more than the contract can pay", async function() {
        await instance.fundContract({value: web3.utils.toWei("0.5", "ether"),        
        from: accounts[2]});
        instance.getBalance();
        await truffleAssert.fails(instance.placeBet({value: web3.utils.toWei("10", "ether"), from: accounts[5]}), truffleAssert.ErrorType.REVERT);
    });

    it("should be possible for contract owner to withdraw funds", async function() {
        //await instance.fundContract({value: web3.utils.toWei("1", "ether"),        
        //from: accounts[6]});
        await truffleAssert.passes(instance.withdrawBalance());
    });

    it("should not allow non-owners to withdraw funds", async function() {
        await instance.fundContract({value: web3.utils.toWei("1", "ether"), from: accounts[7]});
        
        await truffleAssert.fails(instance.withdrawBalance({from: accounts[1]}), truffleAssert.ErrorType.REVERT);
    })
})