import { ethers } from 'ethers';

const AbiCoder = new ethers.utils.AbiCoder();

// console.log('add', AbiCoder.encode(['uint', 'uint'], [1, 2]));
// console.log('average', AbiCoder.encode(['uint[]'], [[1, 2, 3, 4, 5]]));

console.log('encode', AbiCoder.encode(['address'], ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]));
