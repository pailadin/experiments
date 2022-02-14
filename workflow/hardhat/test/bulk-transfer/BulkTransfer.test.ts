import { expect, use } from 'chai';
import { ethers } from 'hardhat';
import { FakeContract, smock } from '@defi-wonderland/smock';

import { IGnosisSafe } from '../../typechain-types'

use(smock.matchers);

describe('BulkTransfer', function () {
  const { AddressZero } = ethers.constants;

  beforeEach(async function () {
    const [ owner, delegate01 ] = await ethers.getSigners();

    const BulkTransferFactory = await ethers.getContractFactory('BulkTransfer', owner);

    const bulkTransfer = await BulkTransferFactory.deploy();

    this.bulkTransfer = bulkTransfer;
    this.owner = owner;
    this.delegate01 = delegate01;
  });

  it('should deploy successfully', async function () {
    const actual = await this.bulkTransfer.deployed();

    expect(actual).to.be.equal(this.bulkTransfer);
  });

  it('should revert when the module is not the one who calls', async function () {
    let fake: FakeContract<IGnosisSafe>
    
    fake = await smock.fake('IGnosisSafe');

    await expect(this.bulkTransfer.executeBulkTransfer(
      fake.address, [{ recipient: this.delegate01.address, token: AddressZero, amount: 10 }]
    )).to.be.revertedWith('Only the `WorkflowModule` can call');
  })

  it.skip('should revert when Ether is the token', async function () {
    let fake: FakeContract<IGnosisSafe>
    
    fake = await smock.fake('IGnosisSafe');

    fake.execTransactionFromModule(0, 'Cannot execute ether transfer.');

    await expect(this.bulkTransfer.executeBulkTransfer(
      fake.address, [{ recipient: this.delegate01.address, token: AddressZero, amount: 10 }]
    )).to.be.reverted;
  })
});
