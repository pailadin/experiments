import { expect } from "chai";
import { AbiCoder } from "ethers/lib/utils";
import { ethers } from "hardhat";

describe.only("FlowStationWorkflowModule", function () {
  const NO_ADDRESS = '0x0000000000000000000000000000000000000000';

  it("should be deployed", async function () {
    const [owner] = await ethers.getSigners();

    const FlowStationWorkflowModule = await ethers.getContractFactory('FlowStationWorkflowModule', owner);

    const flowStation = await FlowStationWorkflowModule.deploy();
    
    await flowStation.deployed();
    
    expect(await flowStation.deployed()).to.equal(flowStation);

    expect(await flowStation.safeWorkflows(owner.address, 0)).to.equals(NO_ADDRESS);

    expect(await flowStation.safeWorkflowCount(owner.address)).to.equals(0);

    expect(await flowStation.workflowDelegates(owner.address, 0, 0)).to.equals(NO_ADDRESS);

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

    expect(await flowStation.safeWorkflows(owner.address, 0)).to.not.equals(NO_ADDRESS);
  });
});
