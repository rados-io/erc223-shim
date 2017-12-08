pragma solidity ^0.4.11;

import "./ERC20.sol";

contract TokenDispenser {
  event Donation(address requester, uint256 amount);

  function dispense(address token) {
    ERC20(token).transfer(msg.sender, 150000);
    Donation(msg.sender, 150000);
  }
}
