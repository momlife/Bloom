pragma solidity ^0.4.13;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract MomLifeInputWallet is Ownable {
    function checkMomLifeInputWalletOwner(address addr) external constant returns(bool) {
        require(addr == owner);
        return true;
    }
}
