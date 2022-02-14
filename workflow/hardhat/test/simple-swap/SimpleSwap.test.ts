import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('SimpleSwap', function () {
  beforeEach(async function () {
    const [ owner ] = await ethers.getSigners();

    const SimpleSwapFactory = await ethers.getContractFactory('SimpleSwap', owner);

    const simpleSwap = await SimpleSwapFactory.deploy();

    this.simpleSwap = simpleSwap;
    this.owner = owner;
  });

  it('should deploy successfully', async function () {
    const actual = await this.simpleSwap.deployed();

    expect(actual).to.be.equal(this.simpleSwap);
  });

  it('should the owner be the deployer', async function () {
    const actual = await this.simpleSwap.owner();

    const expected = await this.owner.getAddress();

    expect(actual).to.be.equal(expected);
  });

  describe('#getBalance', function () {
    it('should the balance of the owner', async function () {
      const actual = await this.simpleSwap.getBalance();

      expect(actual).to.be.gt(0);
    });
  });

  describe('#swapAndSend', function () {
    it('should revert with, \'Must pass non 0 ETH amount\'', async function () {
      const [ _, delegate01 ] = await ethers.getSigners();

      await expect(this.simpleSwap.swapAndSend(delegate01.address, { value: 0 })).revertedWith('Must pass non 0 amount');
    });
  });

  describe('#quoteUsdtFromEth', function () {
    it('should revert with self authority, when it is not called by a contract', async function () {
      await expect(this.simpleSwap.quoteUsdtFromEth(10)).revertedWith('Only the `WorkflowModule` can call');
    });

    it.skip('should revert when _wethAmount is 0', async function () {
      await expect(this.simpleSwap.quoteUsdtFromEth(0)).revertedWith('Must pass non 0 amount');
    });

    it.skip('should be fulfilled');
  });
});
