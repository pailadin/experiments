const { expect, use } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const truffleContract = require("@truffle/contract")
const utils = require('@gnosis.pm/safe-contracts/test/utils/general')
const GnosisSafeBuildInfo = require('@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json')
const GnosisSafeProxyBuildInfo = require('@gnosis.pm/safe-contracts/build/contracts/GnosisSafeProxy.json');

const { ADDRESS_ZERO } = require('./constants');
const { execTransaction } = require('./helper');

const GnosisSafe = truffleContract(GnosisSafeBuildInfo)
GnosisSafe.setProvider(web3.currentProvider)

const GnosisSafeProxy = truffleContract(GnosisSafeProxyBuildInfo)
GnosisSafeProxy.setProvider(web3.currentProvider)

const BulkTransfer = artifacts.require("./BulkTransfer.sol")
const TestToken = artifacts.require("./TestToken.sol")

use(chaiAsPromised);

contract.only('BulkTransfer', function(accounts) {
  let lw
  let gnosisSafe
  let bulkTransferSafeModule

  const CALL = 0;

  beforeEach(async function() {    
    lw = await utils.createLightwallet()

    let mod = await BulkTransfer.deployed()
    
    console.log('BulkTransferModule', mod.address)
    
    bulkTransferSafeModule = await BulkTransfer.new()

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
      ADDRESS_ZERO, 0, 
      ADDRESS_ZERO, 
      { from: accounts[0] }
    );
  });

  it('should deploy the BulkTransfer', async () => {
    const token = await TestToken.new({from: accounts[0]})
    await token.transfer(gnosisSafe.address, 1000, {from: accounts[0]}) 
    
    const enableModuleData = gnosisSafe.contract.methods.enableModule(bulkTransferSafeModule.address).encodeABI()
    await execTransaction(gnosisSafe, lw, utils, accounts, gnosisSafe.address, 0, enableModuleData, CALL, "enable module")

    const safeModules = await gnosisSafe.getModules()

    assert.equal(1, safeModules.length)
    assert.equal(bulkTransferSafeModule.address, safeModules[0]);
  });

  it.skip('should execute transfer', async () => {
    const token = await TestToken.new({from: accounts[0]})
    await token.transfer(gnosisSafe.address, 1000, {from: accounts[0]}) 
    
    let enableModuleData = await gnosisSafe.contract.methods.enableModule(bulkTransferSafeModule.address).encodeABI()
    await execTransaction(gnosisSafe, lw, utils, accounts, gnosisSafe.address, 0, enableModuleData, CALL, "enable module")

    let bulkTransferData = await bulkTransferSafeModule
      .contract
      .methods
      .executeBulkTransfer(
        gnosisSafe.address, 
        [
          [accounts[1], token.address, 10],
        ]
      ).encodeABI();
      
    await expect(execTransaction(
      gnosisSafe, lw, utils, accounts,
      bulkTransferSafeModule.address, 
      0, 
      bulkTransferData, 
      CALL, 
      "execute transfer"
    )).to.eventually.be.fulfilled;
  });
})
