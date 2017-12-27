let MomLifeToken = artifacts.require("./MomLifeToken.sol");
let MomLifeInputWallet = artifacts.require("./MomLifeInputWallet.sol");
let MomCoinCrowdsale = artifacts.require("./MomLifeCrowdsale.sol");

module.exports = function(deployer) {
  deployer.deploy(MomLifeInputWallet)
  deployer.deploy(MomLifeToken, 10000000000 * (10 ** 18));

  //deployer.deploy(MomLifeCrowdsale);
};
