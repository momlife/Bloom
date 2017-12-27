pragma solidity ^0.4.13;

import "zeppelin-solidity/contracts/token/MintableToken.sol";

contract MomLifeToken is MintableToken {

    string public name = "MMT v0.3a";
    string public symbol = "MMT3a";
    uint8 public decimals = 18;

    /**
     * @dev Address for accumulation of tokens that incoming to service contract wallets MomLifeInputWallet
     */
    address public parentTransferAddress;

    /*
     * @dev Triggering this event when receive tokens to service contract wallets MomLifeInputWallet
     */
    event TransferToParent(address indexed from, address indexed to, address parent, uint256 value);


    function MomLifeToken(uint256 _initialSupply) {

        transferOwnership(msg.sender);

        transferMomlifeInputWalletParentAddress(msg.sender);

        if(_initialSupply > 0) {
            mint(owner, _initialSupply);
            finishMinting();
        }
    }

    /*
     * @dev Set address for accumulation. Must be owner of service contract wallets
     */
    function transferMomlifeInputWalletParentAddress(address _newParentAdress) onlyOwner {
        if (_newParentAdress != address(0)) {
            parentTransferAddress = _newParentAdress;
        }
    }

    /**
     * @dev Check if given address is instance of MomLifeInputWallet contract and owned by parentTransferAddress
     * @dev
     * @param addr address
     */
    function isMomlifeInputWalletOwner(address _addr) internal constant returns (bool result) {
        uint size = 0;
        assembly {
            size := extcodesize(_addr)
        }
        if(size > 0) {
            return _addr.call.gas(500)(bytes4(sha3("checkMomLifeInputWalletOwner(address)")), parentTransferAddress);
        }
    }

    /**
     * @dev Transfer tokens from one address to another
     * @param _from address The address which you want to send tokens from
     * @param _to address The address which you want to transfer to
     * @param _value uint256 the amout of tokens to be transfered
     */
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        if(isMomlifeInputWalletOwner(_to)) {
            success = super.transferFrom(_from, parentTransferAddress, _value);
            if(success) {
                TransferToParent(_from, _to, parentTransferAddress, _value);
            }
        } else {
            success = super.transferFrom(_from, _to, _value);
        }
        return success;
    }


    /**
    * @dev transfer token for a specified address
    * @param _to The address to transfer to.
    * @param _value The amount to be transferred.
    */
    function transfer(address _to, uint256 _value) returns (bool success) {
        if(isMomlifeInputWalletOwner(_to)) {
            success = super.transfer(parentTransferAddress, _value);
            if(success) {
                TransferToParent(msg.sender, _to, parentTransferAddress, _value);
            }
        } else {
            success = super.transfer(_to, _value);
        }
        return success;
    }
}
