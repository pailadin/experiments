//SPDX-License-Identifier: Unlicense
pragma solidity >0.8.0;
pragma abicoder v2;

import "./IGnosisSafe.sol";
import "./BulkTransfer.sol";

/// @notice You can use this contract for basic simulation (bulk transferring and swap)
/// @custom:experimental This is an experimental contract
contract WorkflowModuleV2 is BulkTransfer {
    string public constant NAME = "Workflow Module V2";

    string public constant VERSION = "0.0.2";

    struct Action {
        bytes4 selector;
        bytes arguments;
    }

    struct Workflow {
        IGnosisSafe safe;
        Action[] actions;
        address[] delegates;
    }

    /// @notice Execute actions
    function executeWorkflow(
        Action[] calldata _actions
    ) external payable {
        bool success;
        bytes memory data;

        for (uint index = 0; index < _actions.length; index++) {
            (success, data) = address(this).call(
                abi.encodePacked(_actions[index].selector, _actions[index].arguments)
            );
        } 
        
        require(success, "Call failed!");
    }
}
