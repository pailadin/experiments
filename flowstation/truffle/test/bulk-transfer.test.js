const utils = require('@gnosis.pm/safe-contracts/test/utils/general')

const truffleContract = require("@truffle/contract")
const { ADDRESS_ZERO } = require('./constants');
const GnosisSafeBuildInfo = require("@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json")
const GnosisSafe = truffleContract(GnosisSafeBuildInfo)
GnosisSafe.setProvider(web3.currentProvider)

const GnosisSafeProxyBuildInfo = require("@gnosis.pm/safe-contracts/build/contracts/GnosisSafeProxy.json")
const GnosisSafeProxy = truffleContract(GnosisSafeProxyBuildInfo)
GnosisSafeProxy.setProvider(web3.currentProvider)

const BulkTransfer = artifacts.require("./BulkTransfer.sol")
const TestToken = artifacts.require("./TestToken.sol")

contract('BulkTransfer', function(accounts) {
  let lw
  let gnosisSafe
  let bulkTransferSafeModule

  const CALL = 0;

  beforeEach(async function() {
    // Create lightwallet
    lw = await utils.createLightwallet()

    // Create Master Copies
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

  let execTransaction = async function(to, value, data, operation, message) {
    let nonce = await gnosisSafe.nonce()
    let transactionHash = await gnosisSafe.getTransactionHash(to, value, data, operation, 0, 0, 0, ADDRESS_ZERO, ADDRESS_ZERO, nonce)
    let sigs = utils.signTransaction(lw, [lw.accounts[0], lw.accounts[1]], transactionHash)
    utils.logGasUsage(
        'execTransaction ' + message,
        await gnosisSafe.execTransaction(to, value, data, operation, 0, 0, 0, ADDRESS_ZERO, ADDRESS_ZERO, sigs, { from: accounts[0] })
    )
  }

  it('should deploy the BulkTransfer', async () => {
    const token = await TestToken.new({from: accounts[0]})
    await token.transfer(gnosisSafe.address, 1000, {from: accounts[0]}) 
    
    let enableModuleData = await gnosisSafe.contract.methods.enableModule(bulkTransferSafeModule.address).encodeABI()
    await execTransaction(gnosisSafe.address, 0, enableModuleData, CALL, "enable module")

    let modules = await gnosisSafe.getModules()

    assert.equal(1, modules.length)
    assert.equal(bulkTransferSafeModule.address, modules[0]);
  });

  it('should execute transfer', async () => {
    const token = await TestToken.new({from: accounts[0]})
    await token.transfer(gnosisSafe.address, 1000, {from: accounts[0]}) 
    
    let enableModuleData = await gnosisSafe.contract.methods.enableModule(bulkTransferSafeModule.address).encodeABI()
    await execTransaction(gnosisSafe.address, 0, enableModuleData, CALL, "enable module")

    let bulkTransferData = await bulkTransferSafeModule
      .contract
      .methods
      .executeBulkTransfer(
        gnosisSafe.address, 
        [
          [accounts[1], token.address, 10]
        ]
      ).encodeABI();

    await execTransaction(
      bulkTransferSafeModule.address, 
      0, 
      bulkTransferData, 
      CALL, 
      "execute transfer"
    );
  });
})
