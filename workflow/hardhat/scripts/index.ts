import { ethers } from 'ethers';

const AbiCoder = new ethers.utils.AbiCoder();

const generateTransactionHash = (args: {
  abi: string[];
  functionName: string;
  signature: string[];
  values: any[];
}) => {
  const iFace = new ethers.utils.Interface(args.abi);
  const selector = iFace.getSighash(args.functionName);

  const tx = AbiCoder.encode(args.signature, args.values);

  return [selector, tx];
}

console.log('#executeBulkTransfer', generateTransactionHash({
  abi: ['function executeBulkTransfer(address,tuple(address,address,uint256)[])'],
  functionName: 'executeBulkTransfer',
  signature: ['address', 'tuple(address,address,uint256)[]'],
  values: [
    '0x2700208D4b0b2bb83CF89601d5691b08c296Ae72',
    // recipient, token, amount
    [['0xB0E965c2c3Ab93007662B6Efaff38549bA01FbFF', '0xc778417E063141139Fce010982780140Aa0cD5Ab', 100]],
  ]
}))

// BulkTransfer
// 0x2700208D4b0b2bb83CF89601d5691b08c296Ae72
// ["0xC9e29C46E35AA801a8226886912a9b1A9e355D47"]
// [["0x0ebaf650", "0x0000000000000000000000002700208d4b0b2bb83cf89601d5691b08c296ae7200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000b0e965c2c3ab93007662b6efaff38549ba01fbff000000000000000000000000c778417e063141139fce010982780140aa0cd5ab00000000000000000000000000000000000000000000000000000000000003e8"]]


console.log('#swapAndSend', generateTransactionHash({
  abi: ['function swapAndSend(uint256,address)'],
  functionName: 'swapAndSend',
  signature: ['uint256', 'address'],
  values: [
    1000,
    '0xB0E965c2c3Ab93007662B6Efaff38549bA01FbFF'
  ],
}))

// UniswapV3
// 0x2700208D4b0b2bb83CF89601d5691b08c296Ae72
// ["0xC9e29C46E35AA801a8226886912a9b1A9e355D47"]
