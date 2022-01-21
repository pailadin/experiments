//SPDX-License-Identifier: Unlicense
pragma solidity <=8.11.0;
pragma abicoder v2;

import "./IFlowStationWorkflowModule.sol";

contract FlowStationWorkflowModule is IFlowStationWorkflowModule {
    string public constant NAME = "Flow Station Workflow Module";

    string public constant VERSION = "0.0.1";
    
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

    /// @dev Safe -> Delegate
    mapping(address => mapping(uint => address)) public _delegates;
    
    /// @dev Safe -> Workflow[]
    mapping(address => mapping(uint => Workflow[])) public workflows;

    // Workflow[] workflows;

    int256 count = workflows.length;

    function listWorkflows() external view returns(Workflow[]) {
        return workflows;
    }

    // Add storage (key <> value pair)
    function addWorkflow(
        GnosisSafe safe,
        address[] calldata delegates,
        Action[] calldata actions
    ) external authorized returns (uint256) {
        Workflow workflow;
        workflow.safe = safe;
        workflow.delegates = delegates;
        workflow.actions = actions;

        workflows[address(safe)][count] = workflow;
    }


    function executeBulkTransfer(
        GnosisSafe safe,
        Transfer[] calldata transfers
    ) public {
        for (uint256 i = 0; i < transfers.length; i++) {
            transfer(safe, transfers[i].token, payable(transfers[i].recipient), transfers[i].amount);
        }
    }

    function transfer(
        GnosisSafe safe,
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
                "cannot execute ether transfer"
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
                "cannot execute token transfer"
            );
        }
    }

    function executeWorkflow(
        uint256 workflow
        // bytes[] calldata arguments
    ) external {
      workflow;
    }

    function executeTransfers(
        GnosisSafe safe,
        Transfer[] calldata transfers
    ) external {
        for (uint256 i = 0; i < transfers.length; i++) {
            transfer(safe, transfers[i].token, payable(transfers[i].recipient), transfers[i].amount);
        }
    }

    function getSelector(string calldata _func) external pure returns (bytes4) {
        return bytes4(keccak256(bytes(_func)));
    }
}
