import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('BulkTransfer', function () {
  beforeEach(async function () {
    const [ owner ] = await ethers.getSigners();

    const BulkTransferFactory = await ethers.getContractFactory('BulkTransfer', owner);

    const bulkTransfer = await BulkTransferFactory.deploy();

    this.bulkTransfer = bulkTransfer;
    this.owner = owner;
  });

  it('should deploy successfully', async function () {
    const actual = await this.bulkTransfer.deployed();

    expect(actual).to.be.equal(this.bulkTransfer);
  });
});
