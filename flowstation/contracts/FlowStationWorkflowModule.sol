//SPDX-License-Identifier: Unlicense
pragma solidity <=8.11.0;
pragma abicoder v2;

import "hardhat/console.sol";

import "./GnosisSafe.sol";

contract FlowStationWorkflowModule {
    string public constant NAME = "FlowStation Workflow Module";

    string public constant VERSION = "0.0.1";

    struct Action {
        bytes4 selector;
        bytes arguments;
    }

    struct Workflow {
        GnosisSafe safe;
        address[] delegates;
        Action[] actions;
    }

    Workflow[] public workflows;

    /// @dev Safe -> workflow id -> Workflow
    mapping(address => mapping(uint => Workflow)) public safeWorkflows;

    /// @dev Safe -> number of workflows
    mapping(address => uint) public safeWorkflowCount;

    /// @dev Safe -> Workflow -> index -> delegate address
    mapping(address => mapping(uint => mapping(uint => address))) public workflowDelegates;

    /// @dev Safe -> Delegate -> Delegate or not
    mapping (address => mapping(address => bool)) private activeWorkflowDelegate;

    modifier canDelegate(address _safe, address _sender) {
        require(activeWorkflowDelegate[_safe][_sender] == true, "Sender is not a delegate");
        _;
    }

    event ExecuteWorkflow(bytes _data);

    /// @dev it should update the workflowDelegates
    function addWorkflow(
        GnosisSafe _safe,
        address[] calldata _delegates,
        Action[] calldata _actions
    ) external returns(uint)  {
        address safeAddress = address(_safe);

        uint count = safeWorkflowCount[safeAddress];

        safeWorkflows[safeAddress][count].safe = _safe;
        safeWorkflows[safeAddress][count].delegates = _delegates;

        for (uint index = 0; index < _actions.length; index++) {
            safeWorkflows[safeAddress][count].actions.push(_actions[index]);
        }
        
        safeWorkflowCount[safeAddress]++;
        
        for (uint index = 0; index < _delegates.length; index++) {
            activeWorkflowDelegate[safeAddress][_delegates[index]] = true;    
        }

        return count;
    }

    function executeWorkflow(GnosisSafe _safe, uint _workflow) external payable canDelegate(address(_safe), msg.sender) {
        Workflow memory workflow = safeWorkflows[address(_safe)][_workflow];

        bool success;
        bytes memory data;

        for (uint index = 0; index < workflow.actions.length; index++) {
            
            (success, data) = address(this).call(
                abi.encodePacked(workflow.actions[index].selector, workflow.actions[index].arguments)
            );

            emit ExecuteWorkflow(data);
        } 
        
        require(success, "Call failed!");
    }

    /// @dev Testing purposes
    function add(uint _a, uint _b) public pure returns(uint) {
        return _a + _b;
    }

    /// @dev Testing purposes
    function average(uint[] memory _numbers) public pure returns(uint) {
        uint sum = 0;

        for (uint index = 0; index < _numbers.length; index++) {
            sum += _numbers[index];
        }

        return sum / _numbers.length;
    }

    /// @dev Testing purposes
    function greet(string memory _greet) public pure returns(string memory) {
        return _greet;
    }
    
    /// @dev Testing purposes
    function getSelector(string calldata _func) external pure returns (bytes4) {
        return bytes4(keccak256(bytes(_func)));
    }

    /// @dev Testing purposes
    function getByte(string memory _greet) external pure returns (bytes memory) {
        bytes memory data = abi.encodeWithSignature("greet(string)", _greet);

        return data;
    }
}
