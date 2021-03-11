const RaffleContract = artifacts.require("RaffleContract");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(RaffleContract);
};