// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {USDX} from "../src/USDX.sol";
import {TravelToken} from "../src/TravelToken.sol";
import {PlaceNFT} from "../src/PlaceNFT.sol";
import {TravelCheckin} from "../src/TravelCheckin.sol";
import {ProductVault} from "../src/ProductVault.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        // 1. Deploy USDX
        uint256 initialSupply = 1_000_000 * 10 ** 6; // 1M USDX
        USDX usdx = new USDX(initialSupply);
        console.log("USDX deployed at:", address(usdx));

        // 2. Deploy TravelToken
        TravelToken travelToken = new TravelToken();
        console.log("TravelToken deployed at:", address(travelToken));

        // 3. Deploy PlaceNFT
        PlaceNFT placeNFT = new PlaceNFT();
        console.log("PlaceNFT deployed at:", address(placeNFT));

        // 4. Deploy TravelCheckin
        TravelCheckin checkin = new TravelCheckin(
            address(travelToken),
            address(placeNFT)
        );
        console.log("TravelCheckin deployed at:", address(checkin));

        // 5. Deploy ProductVault
        uint256 feePercentage = 250; // 2.5%
        ProductVault vault = new ProductVault(
            address(usdx),
            address(travelToken),
            msg.sender, // feeRecipient
            feePercentage
        );
        console.log("ProductVault deployed at:", address(vault));

        // Configure roles
        bytes32 MINTER_ROLE = keccak256("MINTER_ROLE");

        travelToken.grantRole(MINTER_ROLE, address(checkin));
        console.log("Granted MINTER_ROLE to TravelCheckin on TravelToken");

        placeNFT.grantRole(MINTER_ROLE, address(checkin));
        console.log("Granted MINTER_ROLE to TravelCheckin on PlaceNFT");

        vm.stopBroadcast();

        console.log("\n=== Deployment Summary ===");
        console.log("USDX:", address(usdx));
        console.log("TravelToken:", address(travelToken));
        console.log("PlaceNFT:", address(placeNFT));
        console.log("TravelCheckin:", address(checkin));
        console.log("ProductVault:", address(vault));
    }
}
