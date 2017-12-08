var DumbReceiverWithAssertions = artifacts.require("./DumbReceiverWithAssertions.sol");

module.exports = (deployer, network, accounts) => {
  deployer.deploy(DumbReceiverWithAssertions);
};
