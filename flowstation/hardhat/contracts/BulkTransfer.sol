//SPDX-License-Identifier: Unlicense
pragma solidity <=0.8.11;

import "@gnosis.pm/safe-contracts/contracts/common/Enum.sol";
import "@gnosis.pm/safe-contracts/contracts/external/GnosisSafeMath.sol";

import "./SelfAuthority.sol";
import "./IGnosisSafe.sol";

contract BulkTransfer is SelfAuthority {
    using GnosisSafeMath for uint256;

    struct Transfer {
      address recipient;
      address token;
      uint256 amount;
    }
    
    modifier shouldHaveTransfers(Transfer[] calldata transfers) {
        require(transfers.length > 0, "It should have transfers");

        _;
    }

    function executeBulkTransfer(
        IGnosisSafe safe,
        Transfer[] calldata transfers
    ) external selfAuthorized shouldHaveTransfers(transfers) {
        for (uint256 i = 0; i < transfers.length; i++) {
            transfer(safe, transfers[i].token, payable(transfers[i].recipient), transfers[i].amount);
        }
    }

    function transfer(
        IGnosisSafe safe,
        address token,
        address payable to,
        uint256 amount
    ) private {
        if (token == address(0)) {
            require(
                safe.execTransactionFromModule(
                    to,
                    amount,
                    "",
                    Enum.Operation.Call
                ),
                "Cannot execute ether transfer."
            );
        } else {
            bytes memory data = abi.encodeWithSignature(
                "transfer(address,uint256)",
                to,
                amount
            );
            
            require(
                safe.execTransactionFromModule(
                    token,
                    0,
                    data,
                    Enum.Operation.Call
                ),
                "Cannot execute token transfer."
            );
        }
    }
}
