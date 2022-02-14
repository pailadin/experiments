// SPDX-License-Identifier: UNLICENSED
pragma solidity <=0.8.11;

contract Utility {
    function encode(bytes4 selector, bytes memory arguments) public pure returns(bytes memory) {
        return abi.encode(selector, arguments);
    }

    function pack(bytes4 selector, bytes memory arguments) public pure returns(bytes memory) {
        return abi.encodePacked(selector, arguments);
    }

    function signature() public pure returns(bytes memory) {
        return abi.encodeWithSignature("add(uint256,uint256)", 1,2);
    }

    function exec(bytes4 selector, bytes memory arguments) public returns(bytes memory) {
        bool success;
        bytes memory data;

        (success, data) = address(this).call(
            abi.encodePacked(selector, arguments)
        );

        require(success, "Call failed!");

        return data;
    }

    /// @dev Testing purposes
    function add(uint _a, uint _b) public pure returns(uint) {
        return _a + _b;
    }

    struct Body {
        uint256 numOne;
    }
    
    function sumArr(Body[] calldata body) public pure returns(uint) {
        return body[0].numOne + body[1].numOne;
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
