//SPDX-License-Identifier: Unlicensed
pragma solidity <=0.8.11;

contract SelfAuthority {
    function requireSelfCallOnly() private view {
        require(msg.sender == address(this), "Only the `WorkflowModule` can call");
    }

    modifier selfAuthorized() {
        requireSelfCallOnly();
        _;
    }
}
