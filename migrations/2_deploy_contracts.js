var MomLifeToken = artifacts.require("./MomLifeToken.sol");
var MomLifeInputWallet = artifacts.require("./MomLifeInputWallet.sol");
var MomCoinCrowdsale = artifacts.require("./MomLifeCrowdsale.sol");

module.exports = function(deployer) {
  //deployer.deploy(MomLifeInputWallet)
  deployer.deploy(MomLifeToken, 10000000000 * (10 ** 18));
  //deployer.deploy(MomLifeCrowdsale);
};
