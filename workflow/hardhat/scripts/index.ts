import { ethers } from 'ethers';

const AbiCoder = new ethers.utils.AbiCoder();

var abi = [ "function executeBulkTransfer(address,tuple(address,address,uint256)[])"]
var iface = new ethers.utils.Interface(abi)
var id = iface.getSighash('executeBulkTransfer');

console.log('selector', id)
console.log('executeBulkTransfer', AbiCoder.encode(
  ['address', 'tuple(address,address,uint256)[]'], 
  [
    '0x2700208D4b0b2bb83CF89601d5691b08c296Ae72',
    [['0xB0E965c2c3Ab93007662B6Efaff38549bA01FbFF', '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926', 100]],
  ])
);


// BulkTransfer
// 0x2700208D4b0b2bb83CF89601d5691b08c296Ae72
// ["0xC9e29C46E35AA801a8226886912a9b1A9e355D47"]
// [["0x0ebaf650", "0x0000000000000000000000002700208d4b0b2bb83cf89601d5691b08c296ae7200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000b0e965c2c3ab93007662b6efaff38549ba01fbff000000000000000000000000c778417e063141139fce010982780140aa0cd5ab00000000000000000000000000000000000000000000000000000000000003e8"]]


var abi = [ "function sendUsdt(uint256,address))"]
var iface = new ethers.utils.Interface(abi)
var id = iface.getSighash('sendUsdt');

console.log('selector', id)
console.log('sendUsdt', AbiCoder.encode(
  ['uint256', 'address'], 
  [
    1000,
    '0xB0E965c2c3Ab93007662B6Efaff38549bA01FbFF',
  ])
);

// UniswapV3
// 0x2700208D4b0b2bb83CF89601d5691b08c296Ae72
// ["0xC9e29C46E35AA801a8226886912a9b1A9e355D47"]
