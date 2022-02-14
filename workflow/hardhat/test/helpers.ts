import { getSafeSingletonDeployment } from "@gnosis.pm/safe-deployments";
import { ethers } from "hardhat";
import assert from "assert";
import fs from "fs";
import path from "path";
import SafeSignature from "@gnosis.pm/safe-core-sdk/dist/src/utils/signatures/SafeSignature";

export function encodeSafeTransactionData(
  functionFragment: string,
  values: any[]
) {
  const deployment = getSafeSingletonDeployment({
    version: "1.3.0",
  });

  assert(deployment, "safe deployment must exist");

  return encodeTransactionData(deployment.abi, functionFragment, values);
}

export function encodeFlowStationTransactionData(
  functionFragment: string,
  values: any[]
) {
  const abi = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "./bulk-transfer-abi.json"),
      "utf8"
    )
  );

  return encodeTransactionData(abi, functionFragment, values);
}

export function encodeTransactionData(
  abi: any[],
  functionFragment: string,
  values: any[]
) {
  const iface = new ethers.utils.Interface(abi);
  return iface.encodeFunctionData(functionFragment, values);
}

export const buildSignatureBytes = (signatures: SafeSignature[]): string => {
  signatures.sort((left, right) =>
    left.signer.toLowerCase().localeCompare(right.signer.toLowerCase())
  );
  
  let signatureBytes = "0x";

  for (const sig of signatures) {
    signatureBytes += sig.data.slice(2);
  }
  
  return signatureBytes;
};
