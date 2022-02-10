//SPDX-License-Identifier: Unlicensed
pragma solidity <=0.8.11;

contract NonZeroAmount {
    function nonZeroAmountOnly(uint256 amount) private pure {
        require(amount > 0, "Must pass non 0 amount");
    }

    modifier nonZeroAmount(uint256 amount) {
        nonZeroAmountOnly(amount);
        _;
    }
}
