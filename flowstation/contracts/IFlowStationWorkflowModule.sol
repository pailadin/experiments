// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0;

import "./GnosisSafe.sol";

interface IFlowStationWorkflowModule {
    struct Transfer {
      address token;
      address recipient;
      uint256 amount;
    }

    struct Action {
        bytes4 selector;
        bytes arguments;
    }

    struct Workflow {
        GnosisSafe safe;
        address[] delegates;
        Action[] actions;
    }
    
    function addWorkflow(
        GnosisSafe _safe,
        address[] calldata _delegates,
        Action[] calldata _actions
    ) external returns (uint);

    /// @dev executes the workflow given the safe and it's id
    /// @param _safe This would help us locate what safe that have a _workflow
    /// @param _workflow workflow id
    function executeWorkflow(
        GnosisSafe _safe,
        uint _workflow
        // uint _workflow,
        // bytes[] calldata _arguments
    ) external payable;

    function executeTransfers(
        GnosisSafe safe,
        Transfer[] calldata transfers
    ) external;
}
