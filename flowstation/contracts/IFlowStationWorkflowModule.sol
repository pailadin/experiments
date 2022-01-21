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

    function swap() {}

    function transfer() {}
    
    function addWorkflow(
        GnosisSafe safe,
        address[] calldata delegates,
        Action[] calldata actions
    ) external returns (uint256);

    function executeWorkflow(
        uint256 workflow,
        bytes[] calldata arguments
    ) external;

    function executeTransfers(
        GnosisSafe safe,
        Transfer[] calldata transfers
    ) external;
}
