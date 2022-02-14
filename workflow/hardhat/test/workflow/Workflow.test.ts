import { expect } from "chai";
import { ethers } from "hardhat";

const { AbiCoder } = ethers.utils;

const abiCoder = new AbiCoder();

describe("WorkflowModule", function () {
  const abiCoder = new AbiCoder();
  const { AddressZero } = ethers.constants;

  beforeEach(async function () {
    const [owner, delegate01] = await ethers.getSigners();

    const WorkflowModule = await ethers.getContractFactory('WorkflowModule', owner);

    const workflowModule = await WorkflowModule.deploy();

    this.owner = owner;
    this.delegate01 = delegate01;
    this.workflowModule = workflowModule;
  });

  it("should be deployed", async function () {
    expect(await this.workflowModule.deployed()).to.equal(this.workflowModule);
  });

  it('should have no workflows on the safe in the first place', async function () {
    expect(this.workflowModule.workflows).to.have.length(0);
    expect(await this.workflowModule.safeWorkflowCount(this.owner.address)).to.equals(0);
    expect(await this.workflowModule.workflowDelegates(this.owner.address, 0, 0)).to.equals(AddressZero);
  });

  it('should add a new workflow under a safe', async function () {
    const abi = [ "function greet(string)"]
    const iface = new ethers.utils.Interface(abi)
    const selector = iface.getSighash('greet');

    const args = abiCoder.encode(['string'], ['Hello, HOV!'])
    
    const addWorkflowTx = await this.workflowModule.addWorkflow(
      this.owner.address, 
      [this.owner.address], 
      [{ 
        selector,
        arguments: args,
      }]
    );

    await addWorkflowTx.wait();

    const workflow = await this.workflowModule.workflows(0);
    
    expect(workflow).to.equals(this.owner.address);
  });

  describe('simple functions', function () {
    it('should revert with \'Sender is not a delegate\', when he is not a delegate', async function () {
      const abi = [ "function greet(string)"]
      const iface = new ethers.utils.Interface(abi)
      const selector = iface.getSighash('greet');

      const args = abiCoder.encode(['string'], ['Hello, HOV!'])
  
      const addWorkflowTx = await this.workflowModule.addWorkflow(
        this.owner.address, 
        [this.delegate01.address],
        [{ 
          selector,
          arguments: args,
        }]
      );
  
      await addWorkflowTx.wait();
      
      await expect(this.workflowModule.executeWorkflow(0)).revertedWith('Sender is not a delegat');
    });
  });
  
  describe('BulkTransfer', function () {

  });

  describe('SimpleSwap', function () {

  });
});
