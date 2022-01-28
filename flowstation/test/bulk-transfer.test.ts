/* eslint-disable node/no-missing-import */
import chai, { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import R from "ramda";
import Safe, { EthersAdapter, SafeFactory } from "@gnosis.pm/safe-core-sdk";

import {
  encodeFlowStationTransactionData,
  encodeSafeTransactionData,
} from "./helpers";
import { BulkTransfer } from "../typechain";

const WALLETS = [
  "0x1fC95137c0849D5D91cFC9d18A376111aa7c9E6f",
  "0x04820dbFde040AeD112D4D1028E018219C5203ba",
  "0x0E583c0F2a8FF6B7B7BE1114707eBcaA1a4E551A",
  "0x965A0751C5354C41CBD04B84A2A3533716536ba3",
  "0xF25E60386D90f4a1AD8d65aD2146B9cCEb4DbA55",
];

describe.only("BulkTransfer", function () {
  beforeEach(async function () {
    const signer = ethers.provider.getSigner(WALLETS[0]);

    const ethAdapter = new EthersAdapter({
      ethers,
      signer,
    });

    const balance = await ethAdapter.getBalance(WALLETS[0]!);

    expect(balance.gte(BigNumber.from(25).mul(1e14))).to.be.true;

    const FlowStation = await ethers.getContractFactory("FlowStation");

    const contract = await FlowStation.deploy();

    await contract.deployed();

    this.contract = contract;
    
    console.log(`module contract deployed: ${contract.address}`);

    const safeFactory = await SafeFactory.create({
      ethAdapter,
    });

    const safe = await safeFactory.deploySafe({
      owners: R.take(3, WALLETS),
      threshold: 2,
    });

    this.safe = safe;

    console.log(`safe deployed: ${safe.getAddress()}`);

    (await signer.sendTransaction({
      to: safe.getAddress(),
      value: ethers.utils.parseEther("0.0025"),
    })).wait;

    console.log("ETH sent to safe");

    const owners = await Promise.all(
      R.take(3, WALLETS).map((owner: any) =>
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

    console.log("module enabled");
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
          R.takeLast(2, WALLETS).map((recipient: any) => [
            recipient,
            ethers.utils.parseEther("0.0005"),
            ethers.constants.AddressZero,
          ]),
        ]),
      });

      await Promise.all(
        R.take(2, owners).map((owner: any) => owner.signTransaction(transaction))
      );

      const result = await R.head(owners)!.executeTransaction(transaction, {
        gasLimit: 250000,
      });

      await result.transactionResponse?.wait();

      console.log("transaction executed");
    });
  });
});
