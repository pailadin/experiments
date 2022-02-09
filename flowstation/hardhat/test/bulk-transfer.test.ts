/* eslint-disable node/no-missing-import */
/*import R from "ramda";
import Safe, { EthersAdapter, SafeFactory } from "@gnosis.pm/safe-core-sdk";
import { expect } from "chai";
import { ethers, } from "hardhat";

import {
  encodeFlowStationTransactionData,
  encodeSafeTransactionData,
} from "./helpers";
import { BulkTransfer } from "../typechain";

const SAFE_OWNER_ADDRESS = '0xC9e29C46E35AA801a8226886912a9b1A9e355D47';

describe('BulkTransfer (SLOW)', function () {
  it('should have the correct balance', async function () {
    const owner = await ethers.getSigner('0xC9e29C46E35AA801a8226886912a9b1A9e355D47');
    
    console.log('OWNER ADDRESS: ', await owner.getAddress());

    const ethAdapter = new EthersAdapter({
      ethers,
      signer: owner,
    });
    
    const signer = await ethers.getSigner(owner.address);

    const balance = await signer.getBalance();

    const actual = balance.gt(0);

    expect(actual).to.be.true;

    const BulkTransfer = await ethers.getContractFactory('BulkTransfer');

    const contract = await BulkTransfer.deploy();

    await contract.deployed();

    this.contract = contract;

    console.info('DEPLOYED!!!');
    
    const safeFactory = await SafeFactory.create({
      ethAdapter,
    });

    console.log('SAFE FACTORY DONE');

    const safe = await safeFactory.deploySafe({
      owners: [SAFE_OWNER_ADDRESS],
      threshold: 1,
    });

    this.safe = safe;

    console.log(`safe deployed: ${safe.getAddress()}`);

    (await signer.sendTransaction({
      to: safe.getAddress(),
      value: ethers.utils.parseEther("0.0000001"),
    })).wait;

    console.log("ETH sent to safe");

    const owners = await Promise.all(
      [SAFE_OWNER_ADDRESS].map((owner: any) =>
        safe.connect({
          ethAdapter: new EthersAdapter({
            ethers,
            signer: ethers.provider.getSigner(owner),
          }),
        })
      )
    );
    
    this.owners = owners;

    const transaction = await safe.createTransaction({
      to: safe.getAddress(),
      value: "0",
      data: encodeSafeTransactionData("enableModule", [contract.address]),
    });

    await Promise.all(
      R.take(2, owners).map((owner: any) => owner.signTransaction(transaction))
    );

    await (
      await R.head(owners)!.executeTransaction(transaction)
    ).transactionResponse?.wait();

    console.log("Module enabled");
  });

  describe("#executeBulkTransfer", function () {
    it("should send ETH to multiple recipients", async function () {
      const { safe, owners, contract } = this as unknown as {
        safe: Safe;
        owners: Safe[];
        contract: BulkTransfer;
      };


      const transaction = await safe.createTransaction({
        to: contract.address,
        value: "0",
        data: encodeFlowStationTransactionData("executeBulkTransfer", [
          safe.getAddress(),
          ['0xB0E965c2c3Ab93007662B6Efaff38549bA01FbFF'].map((recipient: any) => [
            recipient,
            ethers.utils.parseEther("0.000000001"),
            ethers.constants.AddressZero,
          ]),
        ]),
      });

      console.log('TRANSACTION CREATED');

      await Promise.all(
        owners.map((owner: any) => owner.signTransaction(transaction))
      );

      const result = await owners[0].executeTransaction(transaction, {
        gasLimit: 250000,
      });

      await result.transactionResponse?.wait();

      console.log("transaction executed");
    });
  });
});*/
