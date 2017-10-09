pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/token/MintableToken.sol";

contract MomLifeToken is MintableToken {

    string public name = "MMT v0.3a";
    string public symbol = "MMT3a";
    uint8 public decimals = 18;

    address public parentTransferAddress;

    event TransferToParent(address indexed from, address indexed to, address parent, uint256 value);

    function MomLifeToken(uint256 _initialSupply) {
        parentTransferAddress = msg.sender;
        transferOwnership(msg.sender);

        if(_initialSupply > 0) {
            mint(owner, _initialSupply);
            finishMinting();
        }
    }

    function changeParent(address newParent) onlyOwner {
        if (newParent != address(0)) {
            parentTransferAddress = newParent;
        }
    }

    function isMomlifeInputWalletOwner(address addr) internal constant returns (bool result) {
        result = false;
        uint size = 0;
        assembly {
            size := extcodesize(addr)
        }
        if(size > 0) {

            bytes4 signature = bytes4(sha3("getMomLifeInputWalletOwner()"));
            address owner = address(0);

            assembly {
                let data := mload(0x40)   //Find empty storage location using "free memory pointer"
                mstore(data,signature)
                let success := call(5000, addr, 0, data, 32, data, 100)
                owner := xor(0x140000000000000000000000000000000000000000,mload(data))
                mstore(0x40,add(data,100))
            }

            if(owner != address(0) && owner == parentTransferAddress) {
                result = true;
            }
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
