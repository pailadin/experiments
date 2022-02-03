const { deployTruffleContract } = require('@gnosis.pm/singleton-deployer-truffle');
const BulkTransfer = artifacts.require("BulkTransfer");

module.exports = function(deployer) {
  deployer.then(async () => {
    await deployTruffleContract(web3, BulkTransfer);
  })
};
