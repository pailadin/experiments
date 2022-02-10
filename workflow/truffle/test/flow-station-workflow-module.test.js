const { expect } = require('chai');
const utils = require('@gnosis.pm/safe-contracts/test/utils/general')
const truffleContract = require("@truffle/contract")
const GnosisSafeBuildInfo = require("@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json")
const GnosisSafeProxyBuildInfo = require("@gnosis.pm/safe-contracts/build/contracts/GnosisSafeProxy.json")
const { ADDRESS_ZERO } = require('./constants');

const GnosisSafe = truffleContract(GnosisSafeBuildInfo)
GnosisSafe.setProvider(web3.currentProvider)

const GnosisSafeProxy = truffleContract(GnosisSafeProxyBuildInfo)
GnosisSafeProxy.setProvider(web3.currentProvider)

const FlowStationWorkflowModule = artifacts.require('./FlowStationWorkflowModule.sol');
const BulkTransfer = artifacts.require("./BulkTransfer.sol");
const TestToken = artifacts.require("./TestToken.sol");

contract('FlowStationWorkflowModule', function(accounts) {
  let lw;
  let gnosisSafe;
  let flowStationWorkflowModule;

  const CALL = 0;

  beforeEach(async function() {
    // Create lightwallet
    lw = await utils.createLightwallet();

    // Create Master Copies
    let bulkTransferContract = await BulkTransfer.deployed();
    
    console.log('BulkTransfer', bulkTransferContract.address);

    bulkTransferSafeModule = await BulkTransfer.new();

    let fmodule = await FlowStationWorkflowModule.deployed();
    
    console.log('FlowStationWorkflowModule', fmodule.address);

    flowStationWorkflowModule = await FlowStationWorkflowModule.new();
    
    const gnosisSafeMasterCopy = await GnosisSafe.new({ from: accounts[0] })

    const proxy = await GnosisSafeProxy.new(gnosisSafeMasterCopy.address, { from: accounts[0] })

    gnosisSafe = await GnosisSafe.at(proxy.address)
    
    await gnosisSafe.setup(
      [
        lw.accounts[0], 
        lw.accounts[1], 
        accounts[1]
      ], 
      2, 
      ADDRESS_ZERO, 
      "0x", 
      ADDRESS_ZERO, 
      ADDRESS_ZERO, 
      0, 
      ADDRESS_ZERO, 
      { from: accounts[0] }
    );
  });

  let execTransaction = async function(to, value, data, operation, message) {
    let nonce = await gnosisSafe.nonce();

    let transactionHash = await gnosisSafe.getTransactionHash(to, value, data, operation, 0, 0, 0, ADDRESS_ZERO, ADDRESS_ZERO, nonce);

    let sigs = utils.signTransaction(lw, [lw.accounts[0], lw.accounts[1]], transactionHash);

    utils.logGasUsage(
        'execTransaction ' + message,
        await gnosisSafe.execTransaction(to, value, data, operation, 0, 0, 0, ADDRESS_ZERO, ADDRESS_ZERO, sigs, { from: accounts[0] })
    );
  }

  it('should deploy FlowStationWorkflowModule', async () => {
    const token = await TestToken.new({from: accounts[0]});

    await token.transfer(gnosisSafe.address, 1000, {from: accounts[0]}) ;
    
    const enableModuleData = await gnosisSafe.contract.methods.enableModule(flowStationWorkflowModule.address).encodeABI();
    
    await execTransaction(gnosisSafe.address, 0, enableModuleData, CALL, "enable module");

    const modules = await gnosisSafe.getModules();

    assert.equal(1, modules.length);
    assert.equal(flowStationWorkflowModule.address, modules[0]);
  });

  describe('#addWorkflow', function () {
    it('should execute', async () => {
      const token = await TestToken.new({from: accounts[0]});
      await token.transfer(gnosisSafe.address, 1000, {from: accounts[0]});
      
      let enableModuleData = await gnosisSafe.contract.methods.enableModule(flowStationWorkflowModule.address).encodeABI();
      
      await execTransaction(gnosisSafe.address, 0, enableModuleData, CALL, "enable module");
      
      const selector = web3.eth.abi.encodeFunctionSignature("add(uint256,uint256)");
      const args = web3.eth.abi.encodeParameters(['uint256','uint256'], ['1', '1']);

      let addWorkflowData = await flowStationWorkflowModule
        .contract
        .methods
        .addWorkflow(
          gnosisSafe.address, 
          [accounts[0], accounts[1]],
          [
            [selector, args]
          ]
        ).encodeABI();
  
      const data = await execTransaction(
        flowStationWorkflowModule.address, 
        0, 
        addWorkflowData, 
        CALL, 
        "add workflow"
      );

      const workflowsFn = await flowStationWorkflowModule.contract.methods.workflows(0);
      const workflow = await workflowsFn.call();

      expect(workflow).to.be.not.undefined;
    });
  });

  describe('#executeWorkflow', function () {
    it('should execute', async () => {
      const token = await TestToken.new({from: accounts[0]});
      await token.transfer(gnosisSafe.address, 1000, {from: accounts[0]});
      
      let enableModuleData = await gnosisSafe.contract.methods.enableModule(flowStationWorkflowModule.address).encodeABI();
      
      await execTransaction(gnosisSafe.address, 0, enableModuleData, CALL, "enable module");
      
      const selector = web3.eth.abi.encodeFunctionSignature("add(uint256,uint256)");
      const args = web3.eth.abi.encodeParameters(['uint256','uint256'], ['1', '1']);

      let addWorkflowData = await flowStationWorkflowModule
        .contract
        .methods
        .addWorkflow(
          gnosisSafe.address, 
          [accounts[0], accounts[1]],
          [
            [selector, args]
          ]
        ).encodeABI();
  
      await execTransaction(
        flowStationWorkflowModule.address, 
        0, 
        addWorkflowData, 
        CALL, 
        "add workflow"
      );

      let executeWorkflowData = await flowStationWorkflowModule
        .contract
        .methods
        .executeWorkflow(0).encodeABI();

      const data = await execTransaction(
        flowStationWorkflowModule.address, 
        0, 
        executeWorkflowData, 
        CALL, 
        "execute workflow"
      );
    });
  });
})
