/* eslint-disable node/no-missing-import */
import { expect } from "chai";
import { ethers, waffle, deployments } from "hardhat";
import { getSafeWithOwners, getMock } from "../utils/setup";
// import { executeContractCallWithSigners } from "../utils/execution";

const { AddressZero, AddressOne } = ethers.constants;


describe('BulkTransfer (Local)', function () {
  const [user1, user2] = waffle.provider.getWallets();

    const setupTests = deployments.createFixture(async ({ deployments }) => {
      await deployments.fixture();
      return {
          safe: await getSafeWithOwners([user1.address]),
          mock: await getMock()
      }
  })

  describe('Deployment', function () {
    it.only('emits event for new module', async () => {
      const { safe } = await setupTests();

      await expect(
          await safe.isModuleEnabled(user2.address)
      ).to.be.true

      await expect(
          await safe.getModulesPaginated(AddressOne, 10)
      ).to.be.deep.equal([[user2.address], AddressOne])
    });

    it('should deploy the safe factory successfully', async function () {
      const [owner, delegate01] = await ethers.getSigners();
      const balance = await owner.getBalance();

      console.log('BALANCE: ', balance);
      
      // const GnosisSafe = await artifacts.readArtifact('GnosisSafe');
      // const gnosisSafe = new ethers.Contract('GnosisSafe', GnosisSafe.abi, owner);
      const GnosisSafe = await ethers.getContractFactory('GnosisSafe', owner);
      const gnosisSafe = await GnosisSafe.deploy();
      await gnosisSafe.deployed();
      
      const GnosisSafeProxy = await ethers.getContractFactory('GnosisSafeProxy', owner);
      const proxy = await GnosisSafeProxy.deploy(gnosisSafe.address);
      await proxy.deployed();
      console.log('GnosisSafeProxy is deployed', proxy.address);
      
      const gnosisSafeWithProxy = gnosisSafe.attach(proxy.address);
      await gnosisSafeWithProxy.deployed();
      
      const BulkTransferFactory = await ethers.getContractFactory('BulkTransfer');
      const BulkTransfer = await BulkTransferFactory.deploy();
      await BulkTransfer.deployed();

      console.info('BulkTransfer Contract Deployed!');

      expect(await BulkTransfer.deployed()).to.equal(BulkTransfer);

      // await gnosisSafeWithProxy.setup(
      //   [
      //     owner.address,
      //     delegate01.address,
      //   ], 
      //   1, 
      //   AddressZero, 
      //   "0x", 
      //   AddressZero, 
      //   AddressZero, 
      //   0, 
      //   AddressZero, 
      //   { from: owner.address }
      // );

      const TestTokenFactory = await ethers.getContractFactory('TestToken', { signer: owner });
      const TestToken = await TestTokenFactory.deploy();
    
      await TestToken.transfer(gnosisSafeWithProxy.address, 1000, { from: owner.address });
      
      let safeModules = await gnosisSafeWithProxy.getModules();
      
      expect(safeModules).to.have.length(0);
      
      console.log('BulkTransfer Address', BulkTransfer.address);
      
      // let ABI = [
      //   "function enableModule(Module module)"
      // ];
      // const coder = new ethers.utils.Interface(ABI);
      // const enableModuleData = coder.encodeFunctionData('enableModule', [BulkTransfer.address]);

      await gnosisSafeWithProxy.enableModule(BulkTransfer.address); 

      expect(BulkTransfer.address).to.equals(safeModules[0]);
    });
  });
});
