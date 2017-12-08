var VerySmartContract = artifacts.require("./VerySmartContract.sol");

module.exports = (deployer, network, accounts) => {
  deployer.deploy(VerySmartContract);
};
