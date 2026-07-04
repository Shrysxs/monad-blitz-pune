// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {PenguinRegistry} from "../src/PenguinRegistry.sol";

/**
 * @title Deploy
 * @notice Deploys PenguinRegistry to Monad Testnet.
 *
 * Usage:
 *   forge script script/Deploy.s.sol:Deploy \
 *     --rpc-url https://testnet-rpc.monad.xyz \
 *     --private-key $PRIVATE_KEY \
 *     --broadcast \
 *     -vvvv
 */
contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying PenguinRegistry...");
        console.log("Deployer:  ", deployer);
        console.log("Chain ID:  ", block.chainid);

        vm.startBroadcast(deployerPrivateKey);

        PenguinRegistry registry = new PenguinRegistry();

        vm.stopBroadcast();

        console.log("PenguinRegistry deployed at:", address(registry));
        console.log("Verify on Monadscan: https://testnet.monadscan.com/address/", address(registry));
    }
}
