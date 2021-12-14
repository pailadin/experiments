// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.7;

contract MultisigWallet {
    enum TransactionType {
        SEND_FUNDS,
        ADD_OWNER,
        REMOVE_OWNER,
        REPLACE_OWNER,
        CHANGE_REQUIREMENT
    }

    struct Transaction {
        address previousOwner;
        address newOwner;
        address owner;
        address initiator;
        address destination;
        uint256 value;
        bytes signature;
        TransactionType transactionType;
        bool executed;
    }

    uint256 public threshold;
    uint256 public transactionCount;
    uint256 internal ownerCount;

    address internal constant SENTINEL_OWNERS = address(0x1);

    mapping(address => address) internal owners;

    mapping(address => bool) public isOwner;
    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmations;

    constructor(address[] memory _owners, uint256 _threshold) {
        address currentOwner = SENTINEL_OWNERS;
        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(
                owner != address(0) &&
                    owner != SENTINEL_OWNERS &&
                    owner != address(this) &&
                    currentOwner != owner,
                "Owner address cannot be null."
            );

            require(owners[owner] == address(0), "No duplicates allowed.");
            owners[currentOwner] = owner;
            currentOwner = owner;
        }
        owners[currentOwner] = SENTINEL_OWNERS;
        ownerCount = _owners.length;
        threshold = _threshold;
    }

    modifier isInitiator(uint256 transactionId) {
        require(transactions[transactionId].initiator == msg.sender);
        _;
    }

    // adds owner
    function proposeAddOwner(address owner, bytes memory signature)
        public
        returns (uint256 transactionId)
    {
        require(!isOwner[owner]);
        transactionId = submitTransaction(
            address(0x1),
            owner,
            address(0x1),
            msg.sender,
            address(0x1),
            0x0,
            signature,
            TransactionType.ADD_OWNER
        );
    }

    // remove owner
    function proposeRemoveOwner(
        address previousOwner,
        address owner,
        bytes memory signature
    ) public returns (uint256 transactionId) {
        require(!isOwner[owner]);
        transactionId = submitTransaction(
            previousOwner,
            address(0x1),
            owner,
            msg.sender,
            address(0x1),
            0x0,
            signature,
            TransactionType.REMOVE_OWNER
        );
    }

    // get owner list
    function getOwners() public view returns (address[] memory) {
        address[] memory array = new address[](ownerCount);

        // populate return array
        uint256 index = 0;
        address currentOwner = owners[SENTINEL_OWNERS];
        while (currentOwner != SENTINEL_OWNERS) {
            array[index] = currentOwner;
            currentOwner = owners[currentOwner];
            index++;
        }
        return array;
    }

    function sendFund(
        address destination,
        uint256 value,
        uint256 dataLength,
        bytes memory data
    ) private returns (bool) {
        bool result;
        assembly {
            let x := mload(0x40) // "Allocate" memory for output (0x40 is where "free memory" pointer is stored by convention)
            let d := add(data, 32) // First 32 bytes are the padded length of data, so exclude that
            result := call(
                sub(gas(), 34710), // 34710 is the value that solidity is currently emitting
                // It includes callGas (700) + callVeryLow (3, to pay for SUB) + callValueTransferGas (9000) +
                // callNewAccountGas (25000, in case the destination address does not exist and needs creating)
                destination,
                value,
                d,
                dataLength, // Size of the input (in bytes) - this is what fixes the padding problem
                x,
                0 // Output is ignored, therefore the output size is zero
            )
        }
        return result;
    }

    // add transaction
    function addTransaction(
        address previousOwner,
        address newOwner,
        address owner,
        address initiator,
        address destination,
        uint256 value,
        bytes memory signature,
        TransactionType transactionType
    ) public returns (uint256 transactionId) {
        transactionId = transactionCount;
        transactions[transactionId] = Transaction({
            previousOwner: previousOwner,
            newOwner: newOwner,
            owner: owner,
            initiator: initiator,
            destination: destination,
            value: value,
            signature: signature,
            transactionType: transactionType,
            executed: false
        });
        transactionCount += 1;
        emit Submission(transactionId);
    }

    // execute transaction after all owners are confirmed
    function executeTransaction(uint256 transactionId)
        public
        isInitiator(transactionId)
    {
        require(
            isConfirmed(transactionId),
            "Number of Confirmations does not meet the threshold."
        );

        Transaction memory transaction = transactions[transactionId];

        if (transaction.transactionType == TransactionType.ADD_OWNER) {
            owners[transaction.newOwner] = owners[SENTINEL_OWNERS];
            owners[SENTINEL_OWNERS] = transaction.newOwner;
            ownerCount++;

            transactions[transactionId].executed = true;
            emit OwnerAdded(transaction.newOwner);
        }

        if (transaction.transactionType == TransactionType.REMOVE_OWNER) {
            address targetOwner = transaction.owner;

            owners[transaction.previousOwner] = owners[targetOwner];
            owners[targetOwner] = address(0);
            ownerCount--;

            transactions[transactionId].executed = true;
            emit OwnerRemoved(targetOwner);
        }

        if (transaction.transactionType == TransactionType.SEND_FUNDS) {
            bool transferred = false;
            // 0xa9059cbb - keccack("transfer(address,uint256)")
            bytes memory data = abi.encodeWithSelector(
                0xa9059cbb,
                transaction.destination,
                transaction.value
            );
            // solhint-disable-next-line no-inline-assembly
            assembly {
                // We write the return value to scratch space.
                // See https://docs.soliditylang.org/en/v0.7.6/internals/layout_in_memory.html#layout-in-memory

                let success := call(
                    sub(gas(), 10000),
                    0,
                    0,
                    add(data, 0x20),
                    mload(data),
                    0,
                    0x20
                )
                switch returndatasize()
                case 0 {
                    transferred := success
                }
                case 0x20 {
                    transferred := iszero(or(iszero(success), iszero(mload(0))))
                }
                default {
                    transferred := 0
                }
            }

            transactions[transactionId].executed = transferred;
            emit SendFunds(transaction.destination, transaction.value);
        }
    }

    // submit transaction = addTransaction and confirmTransaction
    function submitTransaction(
        address previousOwner,
        address newOwner,
        address owner,
        address initiator,
        address destination,
        uint256 value,
        bytes memory signature,
        TransactionType transactionType
    ) public returns (uint256 transactionId) {
        transactionId = addTransaction(
            previousOwner,
            newOwner,
            owner,
            initiator,
            destination,
            value,
            signature,
            transactionType
        );
        confirmTransaction(transactionId);
    }

    // confirm transaction
    function confirmTransaction(uint256 transactionId) public {
        confirmations[transactionId][msg.sender] = true;
        emit Confirmation(msg.sender, transactionId);
    }

    // get confirmation count of desired transaction
    function getConfirmationCount(uint256 transactionId)
        public
        view
        returns (uint256 count)
    {
        address[] memory ownerArray = getOwners();
        for (uint256 i = 0; i < ownerCount; i++)
            if (confirmations[transactionId][ownerArray[i]]) count += 1;
    }

    // check if the transaction is confirmed
    function isConfirmed(uint256 transactionId) public view returns (bool) {
        uint256 count = 0;

        address[] memory ownerArray = getOwners();

        for (uint256 i = 0; i < ownerCount; i++) {
            if (confirmations[transactionId][ownerArray[i]]) count += 1;
            if (count == threshold) return true;
        }

        return false;
    }

    event Confirmation(address indexed sender, uint256 indexed transactionId);
    event Revocation(address indexed sender, uint256 indexed transactionId);
    event Submission(uint256 indexed transactionId);
    event SendFunds(address indexed receiver, uint256 value);
    event OwnerAdded(address indexed owner);
    event OwnerRemoved(address indexed owner);
    event RequirementChanged(uint256 required);
}
