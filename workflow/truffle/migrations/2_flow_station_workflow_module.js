const { deployTruffleContract } = require('@gnosis.pm/singleton-deployer-truffle');
const FlowStationWorkflowModule = artifacts.require("FlowStationWorkflowModule");

module.exports = function(deployer) {
  deployer.then(async () => {
    await deployTruffleContract(web3, FlowStationWorkflowModule);
  })
};
