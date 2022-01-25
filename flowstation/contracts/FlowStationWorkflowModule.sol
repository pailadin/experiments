//SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.0;
pragma abicoder v2;

import "@gnosis.pm/safe-contracts/contracts/common/Enum.sol";
import "@gnosis.pm/safe-contracts/contracts/external/GnosisSafeMath.sol";

interface GnosisSafe {
    /// @dev Allows a Module to execute a Safe transaction without any further confirmations.
    /// @param to Destination address of module transaction.
    /// @param value Ether value of module transaction.
    /// @param data Data payload of module transaction.
    /// @param operation Operation type of module transaction.
    function execTransactionFromModule(
        address to,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation
    ) external returns (bool success);

    /// @dev Checks whether the signature provided is valid for the provided data, hash. Will revert otherwise.
    /// @param dataHash Hash of the data (could be either a message hash or transaction hash)
    /// @param data That should be signed (this is passed to an external validator contract)
    /// @param signatures Signature data that should be verified. Can be ECDSA signature, contract signature (EIP-1271) or approved hash.
    function checkSignatures(
        bytes32 dataHash,
        bytes memory data,
        bytes memory signatures
    ) external view;

    function isOwner(address owner) external view returns (bool);

    function getThreshold() external view returns (uint256);
}

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
    ) external;

    function executeTransfers(
        GnosisSafe safe,
        Transfer[] calldata transfers
    ) external;
}

contract FlowStationWorkflowModule {
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

    Workflow[] public workflows;

    /// @dev Safe -> workflow id -> Workflow
    mapping(address => mapping(uint => Workflow)) public safeWorkflows;

    /// @dev Safe -> number of workflows
    mapping(address => uint) public safeWorkflowCount;

    /// @dev Safe -> Workflow -> index -> delegate address
    mapping(address => mapping(uint => mapping(uint => address))) public workflowDelegates;

    mapping (address => mapping(address => uint8)) activeWorkflowDelegate;

    modifier canDelegate(address _safe, address _sender) {
        require(activeWorkflowDelegate[_safe][_sender] == 1, "Sender is not a delegate");
        _;
    }

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
        
        return count;
    }

    function executeWorkflow(GnosisSafe _safe, uint _workflow) external payable canDelegate(address(_safe), msg.sender) {
        Workflow memory workflow = safeWorkflows[address(_safe)][_workflow];

        bool success;
        bytes memory data;

        for (uint index = 0; index < workflow.actions.length; index++) {
            (success, data) = address(this).call(
                abi.encodeWithSelector(
                    workflow.actions[index].selector,
                    "Hello, Testing!"
                    // workflow.actions[index].arguments
                )
            );
        } 
        
        // emit ExecuteWorkflow(data);
        
        require(success, "Call failed!");
    }
    
    function executeTransfers(
        GnosisSafe safe,
        Transfer[] calldata transfers
    ) external {
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

    /// @dev testing purposes
    function test() external returns(bytes memory) {
        (bool success, bytes memory data) = address(this).call(
            abi.encodeWithSelector(
                bytes4(
                    keccak256(bytes("greet(string)"))
                ),
                "Hello, World!"
            )
        );

        require(success, "Call failed");

        return data;
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
