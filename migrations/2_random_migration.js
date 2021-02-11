const Random = artifacts.require("Random");

module.exports = function (deployer) {
  deployer.deploy(Random);
};
