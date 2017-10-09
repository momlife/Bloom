pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract MomLifeInputWallet is Ownable {
    function getMomLifeInputWalletOwner() public constant returns(address) {
        return owner;
    }
}
