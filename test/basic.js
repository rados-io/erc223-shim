var ERC20Demo = artifacts.require("./ERC20Demo.sol");
var ERC223Upgrade = artifacts.require("./ERC223Upgrade.sol");

contract("ERC20 -> ERC223 basic:", (accounts) => {
  it("...should have the same totalSupply.", async () => {
    const erc20  = await ERC20Demo.deployed();
    const erc223 = await ERC223Upgrade.deployed();

    let supply_erc20  = await erc20.totalSupply();
    let supply_erc223 = await erc223.totalSupply();

    assert.equal(supply_erc20.toString(), supply_erc223.toString(), "Wrong total supply!");
  });

  it("...should have the same decimals.", async () => {
    const erc20  = await ERC20Demo.deployed();
    const erc223 = await ERC223Upgrade.deployed();

    let decimals_erc20  = await erc20.decimals();
    let decimals_erc223 = await erc223.decimals();

    assert.equal(decimals_erc20.toString(), decimals_erc223.toString(), "Wrong decimals!");
  });

  it("...should have the same balance.", async () => {
    const erc20  = await ERC20Demo.deployed();
    const erc223 = await ERC223Upgrade.deployed();

    let balance_erc20  = await erc20.balanceOf(accounts[0]);
    let balance_erc223 = await erc223.balanceOf(accounts[0]);

    assert.equal(balance_erc20.toString(), balance_erc223.toString(), "Balances don't match!");
  });
});
