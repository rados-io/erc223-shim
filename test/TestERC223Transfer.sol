pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TokenDispenser.sol";
import "../contracts/ERC223Upgrade.sol";
import "../contracts/ERC20Demo.sol";


contract TestERC223Transfer {
  event MyBalance(uint rich);

  function beforeAll() {
    ERC223 erc223 = ERC223(DeployedAddresses.ERC223Upgrade());
    ERC20  erc20  = ERC20(DeployedAddresses.ERC20Demo());
    erc20.approve(address(erc223), erc20.totalSupply());

    TokenDispenser donor = TokenDispenser(DeployedAddresses.TokenDispenser());
    donor.dispense(erc20);
  }

  function testTransferWithData() {
    ERC223 erc223     = ERC223(DeployedAddresses.ERC223Upgrade());
    ERC20  erc20      = ERC20(DeployedAddresses.ERC20Demo());
    address recipient = address(DeployedAddresses.DumbReceiverWithAssertions());

    Assert.equal(erc223.balanceOf(recipient), 0, "Balance of recipient address should be 0");
    Assert.equal(erc20.balanceOf(recipient), 0, "Balance of recipient address should be 0");

    bytes memory payload = "0x223";
    erc223.transfer(recipient, 20, payload);

    Assert.equal(erc223.balanceOf(recipient), 20, "Balance of recipient address should be 20");
    Assert.equal(erc20.balanceOf(recipient), 20, "Balance of recipient address should be 20");

    erc223.transfer(0x01, 223, payload);
    Assert.equal(erc223.balanceOf(0x01), 223, "Balance of recipient address should be 223");
    Assert.equal(erc20.balanceOf(0x01), 223, "Balance of recipient address should be 223");
  }

}
