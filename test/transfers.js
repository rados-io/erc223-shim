var ERC20Demo = artifacts.require("./ERC20Demo.sol");
var ERC223Upgrade = artifacts.require("./ERC223Upgrade.sol");
var VerySmartContract = artifacts.require("./VerySmartContract.sol");
var TokenDispenser = artifacts.require("./TokenDispenser.sol");

function assertJump(error) {
  let revertOrInvalid = error.message.search('invalid opcode|revert')
  assert.isAbove(revertOrInvalid, -1, 'Invalid opcode error must be returned');
}

contract("ERC20 -> ERC223 transfers:", (accounts) => {
  before(async () => {
    const erc20  = await ERC20Demo.deployed();
    const erc223 = await ERC223Upgrade.deployed();
    const donor  = await TokenDispenser.deployed();

    let supply = await erc20.totalSupply();

    // approve using ERC223 upgrade shim for test user
    // necessary before we proceed
    erc20.approve(erc223.address, supply.toString());
    await donor.dispense(erc20.address);
  });

  it("Transfer through ERC223 interface requires an approval", async () => {
    const erc223 = await ERC223Upgrade.deployed();
    const erc20  = await ERC20Demo.deployed();

    await erc20.transfer(accounts[1], 12345);

    try {
      await erc223.transfer(accounts[0], 12345, {from: accounts[1]});
      assert.fail('Cannot use ERC223 upgrade interface before you explicitly approve!');
    } catch(error) {
      assertJump(error);
    }

    let supply = await erc20.totalSupply();
    erc20.approve(erc223.address, supply.toString(), {from: accounts[1]});
    await erc223.transfer(accounts[0], 12345, {from: accounts[1]});
  });

  it("Simple transfer between people", async () => {
    const erc20  = await ERC20Demo.deployed();
    const erc223 = await ERC223Upgrade.deployed();

    let supply = await erc20.totalSupply();

    await erc20.transfer(accounts[1], 12345);
    let balance_erc223 = await erc223.balanceOf(accounts[1]);
    assert.equal(12345, balance_erc223.toString(), "ERC20 transfer did not update ERC223 balance.");

    await erc223.transfer(accounts[1], 12345);
    let balance_erc20 = await erc20.balanceOf(accounts[1]);
    assert.equal(12345 * 2, balance_erc20.toString(), "ERC223 transfer did not update erc20 balance.");
  });

  it("Transfer between smart contracts", async () => {
    const erc20         = await ERC20Demo.deployed();
    const erc223        = await ERC223Upgrade.deployed();
    const smartcontract = await VerySmartContract.deployed();

    await erc223.transfer(smartcontract.address, 12345);

    let received = await smartcontract.balanceOf(accounts[0], erc223.address);
    let transferred = await erc20.balanceOf(smartcontract.address);
    assert.equal(transferred.toString(), received.toString(), "Smart contract has received and processed a transfer.");

    try {
      await smartcontract.redeem(erc223.address);
      assert.fail('Cannot use ERC223 upgrade interface before you explicitly approve!');
    } catch(error) {
      assertJump(error);
    }

    await smartcontract.register(erc20.address, erc223.address);
    await smartcontract.redeem(erc223.address);

    let remains = await smartcontract.balanceOf(accounts[0], erc223.address);
    assert.equal(0, remains.toString(), "Smart contract has initiated and completed a transfer.");
  });
});
