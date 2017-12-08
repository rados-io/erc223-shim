pragma solidity ^0.4.11;

import "./ERC223.sol";

contract DumbReceiverWithAssertions is ContractReceiver {
  event Received(address from, uint value, bytes data);

  function tokenFallback(address _from, uint _value, bytes _data) {
    Received(_from, _value, _data);
    bytes memory expected = "0x223";
    if (_value != 20) { revert(); }
    if (keccak256(expected) != keccak256(_data)) { revert(); }
  }
}
