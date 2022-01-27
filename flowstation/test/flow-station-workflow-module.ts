import { expect, use } from "chai";
import { ethers } from "hardhat";

const { AbiCoder } = ethers.utils;

describe("FlowStationWorkflowModule", function () {
  const abiCoder = new AbiCoder();
  const { AddressZero } = ethers.constants;

  it("should be deployed", async function () {
    const [owner] = await ethers.getSigners();

    const FlowStationWorkflowModule = await ethers.getContractFactory('FlowStationWorkflowModule', owner);

    const flowStation = await FlowStationWorkflowModule.deploy();
    
    await flowStation.deployed();
    
    expect(await flowStation.deployed()).to.equal(flowStation);
  });

  it('should have no workflows on the safe in the first place', async function () {
    const [owner] = await ethers.getSigners();

    const FlowStationWorkflowModule = await ethers.getContractFactory('FlowStationWorkflowModule', owner);

    const flowStation = await FlowStationWorkflowModule.deploy();
    
    await flowStation.deployed();

    expect(await flowStation.safeWorkflows(owner.address, 0)).to.equals(AddressZero);
    expect(await flowStation.safeWorkflowCount(owner.address)).to.equals(0);
    expect(await flowStation.workflowDelegates(owner.address, 0, 0)).to.equals(AddressZero);
  });

  it('should add a new workflow under a safe', async function () {
    const [owner] = await ethers.getSigners();

    const FlowStationWorkflowModule = await ethers.getContractFactory('FlowStationWorkflowModule', owner);

    const flowStation = await FlowStationWorkflowModule.deploy();
    
    await flowStation.deployed();

    const selector = await flowStation.getSelector('greet(string)');
    const args = await flowStation.getByte('Hello, HOV!');

    const addWorkflowTx = await flowStation.addWorkflow(
      owner.address, 
      [owner.address], 
      [{ 
        selector,
        arguments: args,
      }]
    );

    await addWorkflowTx.wait();

    expect(await flowStation.safeWorkflows(owner.address, 0)).to.not.equals(AddressZero);
  });

  it('should successfully execute the workflow', async function () {
    const [owner] = await ethers.getSigners();

    const FlowStationWorkflowModule = await ethers.getContractFactory('FlowStationWorkflowModule', owner);

    const flowStation = await FlowStationWorkflowModule.deploy();
    
    await flowStation.deployed();
    
    const selector = await flowStation.getSelector('greet(string)');
    const args = abiCoder.encode(['string'], ['Hello, world!']);

    const addWorkflowTx = await flowStation.addWorkflow(
      owner.address, 
      [owner.address], 
      [{ 
        selector,
        arguments: args,
      }]
    );

    await addWorkflowTx.wait();
    
    expect(await flowStation.executeWorkflow(owner.address, 0)).to.not.eqls({});
  });

  it('should call other contracts transfer')
});
