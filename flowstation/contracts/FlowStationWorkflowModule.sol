// SPDX-License-Identifier: GPL-3.0
pragma solidity >=7.0.0;
pragma abicoder v2;

import "./IFlowStationWorkflowModule.sol";

contract FlowStationWorkflowModule is IFlowStationWorkflowModule {
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
    
    mapping(uint => address) public _delegates;
    mapping(uint => Action) public actions;

    function addWorkflow(
        GnosisSafe safe,
        address[] calldata delegates,
        Action[] calldata actions
    ) external returns (uint256) {
        Workflow workflow;
        workflow.safe = safe;
        workflow.delegates = delegates;
        workflow.actions = actions;
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
            // token transfer
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
        uint256 workflow,
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
