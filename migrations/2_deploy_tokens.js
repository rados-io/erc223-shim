var ERC20Demo      = artifacts.require("./ERC20Demo.sol");
var ERC223Upgrade  = artifacts.require("./ERC223Upgrade.sol");
var TokenDispenser = artifacts.require("./TokenDispenser.sol");

module.exports = (deployer, network, accounts) => {
  deployer.deploy(TokenDispenser).then(() => {
    return deployer.deploy(ERC20Demo, TokenDispenser.address).then(() => {
      return deployer.deploy(ERC223Upgrade, ERC20Demo.address, "Demo223", "D223");
    });
  });
};
