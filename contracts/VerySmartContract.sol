pragma solidity ^0.4.11;


import "./SafeMath.sol";
import "./ERC223.sol";
import "./ERC20.sol";


contract VerySmartContract is ContractReceiver {
  using SafeMath for uint256;

  // person => token => balance
  mapping(address => mapping(address => uint256)) public balances;
  address owner;

  function VerySmartContract() {
    owner = msg.sender;
  }

  // handle incoming EOS223 token transfer
  function tokenFallback(address _from, uint _value, bytes /* _data */) {
    // ERC223 token deposit handler
    balances[_from][msg.sender] = balances[_from][msg.sender].add(_value);
  }

  function balanceOf(address who, address token) constant returns(uint256) {
    return balances[who][token];
  }

  // withdraw ERC223 tokens that were deposited
  function redeem(address token) {
    uint256 balance = balances[msg.sender][token];
    balances[msg.sender][token] = 0;
    ERC223(token).transfer(msg.sender, balance);
  }

  // register the ERC20<>ERC223 pair with the smart contract
  function register(address erc20token, address erc223token) {
    if (msg.sender != owner) { revert(); } // only owner
    ERC20 erc20 = ERC20(erc20token);
    uint256 supply = erc20.totalSupply();
    erc20.approve(erc223token, supply);
  }
}
