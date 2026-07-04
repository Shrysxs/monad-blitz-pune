// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PenguinRegistry {
    event DecisionRecorded(
        string asset,
        string decision,
        uint256 confidence,
        uint256 timestamp,
        address indexed sender
    );

    function recordDecision(
        string calldata asset,
        string calldata decision,
        uint256 confidence,
        uint256 timestamp
    ) external {
        emit DecisionRecorded(asset, decision, confidence, timestamp, msg.sender);
    }
}
