// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {PenguinRegistry} from "../src/PenguinRegistry.sol";

contract PenguinRegistryTest is Test {
    PenguinRegistry public registry;

    event DecisionRecorded(
        string asset,
        string decision,
        uint256 confidence,
        uint256 timestamp,
        address indexed sender
    );

    function setUp() public {
        registry = new PenguinRegistry();
    }

    function testRecordDecision() public {
        vm.expectEmit(true, false, false, true);
        emit DecisionRecorded("BTC", "BUY", 85, 1719999999, address(this));
        
        registry.recordDecision("BTC", "BUY", 85, 1719999999);
    }
}
