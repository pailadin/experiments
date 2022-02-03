/* eslint-disable node/no-missing-import */
import Safe, { EthersAdapter, SafeFactory } from "@gnosis.pm/safe-core-sdk";
import { expect } from "chai";
import { ethers, } from "hardhat";


describe.only('BulkTransfer with Alchemy', function () {
  '@gnosis.pm/safe-contracts/contracts/proxies/ProxyFactory.sol'

  describe('Deployment', function () {
    it('should deploy the safe factory successfully', async function () {
      const [owner] = await ethers.getSigners();

      const ethAdapter = new EthersAdapter({
        ethers,
        signer: owner,
      });
      
      const signer = await ethers.getSigner(owner.address);

      const balance = await signer.getBalance();

      console.log('BALANCE: ', balance);

      const GnosisSafe = await ethers.getContractFactory('GnosisSafe');

      const gnosisSafe = await GnosisSafe.deploy();

      const BulkTransfer = await ethers.getContractFactory('BulkTransfer');

      const bulkTransfer = await BulkTransfer.deploy();

      await bulkTransfer.deployed();

      console.info('BulkTransfer Contract Deployed!');

      expect(await bulkTransfer.deployed()).to.equal(bulkTransfer);
      
      const GnosisSafeProxy = await ethers.getContractFactory('GnosisSafeProxy');

      const gnosisSafeProxy = await GnosisSafeProxy.deploy(bulkTransfer.address);

      console.log('GnosisSafeProxy', gnosisSafeProxy);

      const safeFactory = await SafeFactory.create({
        ethAdapter,
      });
  
      console.log('SAFE FACTORY DONE', safeFactory.getAddress());
    });
  });
});
