// SPDX-License-Identifier: UNLICENSED
pragma solidity <=0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    constructor() ERC20("Test Token", "TT") {
        _mint(msg.sender, 5000000000000000000);
    }
}
