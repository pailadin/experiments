//SPDX-License-Identifier: Unlicense
pragma solidity <=0.8.11;
pragma abicoder v2;

import "./IGnosisSafe.sol";
import "./BulkTransfer.sol";
import "./SimpleSwap.sol";

/// @notice You can use this contract for basic simulation (bulk transferring and swap)
/// @custom:experimental This is an experimental contract
contract WorkflowModule is BulkTransfer, SimpleSwap {
    string public constant NAME = "Workflow Module";

    string public constant VERSION = "0.0.1";

    struct Action {
        bytes4 selector;
        bytes arguments;
    }

    struct Workflow {
        IGnosisSafe safe;
        Action[] actions;
        address[] delegates;
    }

    Workflow[] public workflows;

    /// @dev Safe -> number of workflows
    mapping(address => uint) public safeWorkflowCount;

    /// @dev Safe -> Workflow -> index -> delegate address
    mapping(address => mapping(uint => mapping(uint => address))) public workflowDelegates;

    /// @dev Safe -> Delegate -> Delegate or not
    mapping (address => mapping(address => bool)) private activeWorkflowDelegate;

    modifier canDelegate(bool delegatable) {
        console.log("CAN DELEGATE: ", delegatable);
        require(delegatable, "Sender is not a delegate");

        _;
    }

    event ExecuteWorkflow(bytes _data);

    /// @dev it should update the workflowDelegates
    function addWorkflow(
        IGnosisSafe _safe,
        address[] calldata _delegates,
        Action[] calldata _actions
    ) external returns(uint)  {
        address safeAddress = address(_safe);

        workflows.push();

        uint count = workflows.length;
        uint256 newIndex = workflows.length -1;

        workflows[newIndex].safe = _safe;
        workflows[newIndex].delegates = _delegates;

        for (uint index = 0; index < _actions.length; index++) {
            workflows[newIndex].actions.push(_actions[index]);
        }
        
        safeWorkflowCount[safeAddress]++;
        
        for (uint index = 0; index < _delegates.length; index++) {
            activeWorkflowDelegate[safeAddress][_delegates[index]] = true;    
        }

        return count;
    }

    /// @dev should check the threshold before executing
    function executeWorkflow(uint _workflow) 
        external
        canDelegate(activeWorkflowDelegate[address(workflows[_workflow].safe)][msg.sender] == true) 
        payable {
        Workflow memory workflow = workflows[_workflow];

        bool success;
        bytes memory data;

        // IGnosisSafe safe = workflows[_workflow].safe;

        for (uint index = 0; index < workflow.actions.length; index++) {
            (success, data) = address(this).call(
                abi.encodePacked(workflow.actions[index].selector, workflow.actions[index].arguments)
            );

            emit ExecuteWorkflow(data);
        } 
        
        require(success, "Call failed!");
    }

    /// @dev Testing purposes
    function greet(string memory _greet) public pure returns(string memory) {
        return _greet;
    }
}
