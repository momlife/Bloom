pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/crowdsale/CappedCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/RefundableCrowdsale.sol";
import "zeppelin-solidity/contracts/token/MintableToken.sol";
import "./MomLifeToken.sol";

contract MomLifeCrowdsale is CappedCrowdsale, RefundableCrowdsale {

    // The token being sold
    MomLifeToken public token;

    uint32 internal constant CROWDSALE_STARTBLOCK_SHIFT = 50;
    uint32 internal constant CROWDSALE_ENDBLOCK_SHIFT = 400;
    uint256 internal constant CROWDSALE_RATE = 10 finney;
    uint256 internal constant CROWDSALE_GOAL = 2 ether;
    uint256 internal constant CROWDSALE_CAP = 5 ether;

    function MomLifeCrowdsale()
        CappedCrowdsale(CROWDSALE_CAP)
        FinalizableCrowdsale()
        RefundableCrowdsale(CROWDSALE_GOAL)
        Crowdsale(block.number + CROWDSALE_STARTBLOCK_SHIFT, block.number + CROWDSALE_ENDBLOCK_SHIFT, CROWDSALE_RATE, msg.sender)
    {

    }

    function createTokenContract() internal returns (MintableToken) {
        return new MomLifeToken(0);
    }
}
