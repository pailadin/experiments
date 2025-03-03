/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IWorkflowModule,
  IWorkflowModuleInterface,
} from "../IWorkflowModule";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IGnosisSafe",
        name: "_safe",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_delegates",
        type: "address[]",
      },
      {
        components: [
          {
            internalType: "bytes4",
            name: "selector",
            type: "bytes4",
          },
          {
            internalType: "bytes",
            name: "arguments",
            type: "bytes",
          },
        ],
        internalType: "struct IWorkflowModule.Action[]",
        name: "_actions",
        type: "tuple[]",
      },
    ],
    name: "addWorkflow",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IGnosisSafe",
        name: "safe",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        internalType: "struct IWorkflowModule.Transfer[]",
        name: "transfers",
        type: "tuple[]",
      },
    ],
    name: "executeTransfers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IGnosisSafe",
        name: "_safe",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_workflow",
        type: "uint256",
      },
    ],
    name: "executeWorkflow",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export class IWorkflowModule__factory {
  static readonly abi = _abi;
  static createInterface(): IWorkflowModuleInterface {
    return new utils.Interface(_abi) as IWorkflowModuleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IWorkflowModule {
    return new Contract(address, _abi, signerOrProvider) as IWorkflowModule;
  }
}
