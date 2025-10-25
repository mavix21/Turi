// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {TravelCheckin} from "../src/TravelCheckin.sol";
import {TravelToken} from "../src/TravelToken.sol";
import {PlaceNFT} from "../src/PlaceNFT.sol";

/// @title TuriIntegration
/// @notice End-to-end integration tests simulating real-world Turi app scenarios
contract TuriIntegrationTest is Test {
    TravelCheckin public checkin;
    TravelToken public token;
    PlaceNFT public nft;

    address public turiAdmin = makeAddr("turiAdmin");
    address public tourGuide = makeAddr("tourGuide");
    address public museum = makeAddr("museum");
    address public artisan = makeAddr("artisan");

    // Tourists
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    address public carol = makeAddr("carol");

    function setUp() public {
        vm.startPrank(turiAdmin);

        // Deploy Turi ecosystem
        token = new TravelToken();
        nft = new PlaceNFT();
        checkin = new TravelCheckin(address(token), address(nft));

        // Setup roles
        token.grantRole(token.MINTER_ROLE(), address(checkin));
        nft.grantRole(nft.MINTER_ROLE(), address(checkin));

        // Add validators (tour operators, museums, artisans)
        checkin.addValidator(tourGuide);
        checkin.addValidator(museum);
        checkin.addValidator(artisan);

        // Register tourist attractions
        nft.registerPlace(
            "machu-picchu",
            "Machu Picchu",
            "ipfs://QmMachuPicchu"
        );
        nft.registerPlace("museo-larco", "Museo Larco", "ipfs://QmMuseoLarco");
        nft.registerPlace(
            "artesanias-manos-oro",
            "Artesanias Manos de Oro",
            "ipfs://QmManosOro"
        );
        nft.registerPlace("lineas-nazca", "Lineas de Nazca", "ipfs://QmNazca");
        nft.registerPlace(
            "cevicheria-lima",
            "Cevicheria Lima",
            "ipfs://QmCeviche"
        );

        vm.stopPrank();
    }

    /* ============ Scenario 1: Solo Tourist Journey ============ */

    function test_Scenario_SoloTouristVisitsMultiplePlaces() public {
        // Alice visits 3 places independently
        vm.prank(museum);
        checkin.validateCheckin(alice, "museo-larco", 50 ether);

        vm.prank(artisan);
        checkin.validateCheckin(alice, "artesanias-manos-oro", 75 ether);

        vm.prank(tourGuide);
        checkin.validateCheckin(alice, "machu-picchu", 200 ether);

        // Verify Alice's Turi Passport
        assertEq(
            token.balanceOf(alice),
            325 ether,
            "Reputation score incorrect"
        );
        assertEq(nft.balanceOf(alice), 3, "Should have 3 postal NFTs");

        // Verify all visits are recorded
        assertTrue(checkin.hasVisited(alice, "museo-larco"));
        assertTrue(checkin.hasVisited(alice, "artesanias-manos-oro"));
        assertTrue(checkin.hasVisited(alice, "machu-picchu"));
    }

    /* ============ Scenario 2: Group Tour ============ */

    function test_Scenario_GuidedTourWithTouristGroup() public {
        // Tour guide takes group to Machu Picchu
        address[] memory tourGroup = new address[](3);
        tourGroup[0] = alice;
        tourGroup[1] = bob;
        tourGroup[2] = carol;

        vm.prank(tourGuide);
        checkin.validateGroupCheckin(tourGroup, "machu-picchu", 200 ether);

        // Verify all tourists received rewards
        for (uint256 i = 0; i < tourGroup.length; i++) {
            assertEq(token.balanceOf(tourGroup[i]), 200 ether);
            assertEq(nft.balanceOf(tourGroup[i]), 1);
            assertTrue(checkin.hasVisited(tourGroup[i], "machu-picchu"));
        }

        // Later, same group visits Lineas de Nazca
        vm.prank(tourGuide);
        checkin.validateGroupCheckin(tourGroup, "lineas-nazca", 150 ether);

        // Verify accumulated rewards
        for (uint256 i = 0; i < tourGroup.length; i++) {
            assertEq(token.balanceOf(tourGroup[i]), 350 ether);
            assertEq(nft.balanceOf(tourGroup[i]), 2);
        }
    }

    /* ============ Scenario 3: Mixed Individual and Group Visits ============ */

    function test_Scenario_MixedIndividualAndGroupVisits() public {
        // Alice visits museum solo
        vm.prank(museum);
        checkin.validateCheckin(alice, "museo-larco", 50 ether);

        // Later joins group tour
        address[] memory group = new address[](2);
        group[0] = alice;
        group[1] = bob;

        vm.prank(tourGuide);
        checkin.validateGroupCheckin(group, "machu-picchu", 200 ether);

        // Alice visits artisan solo
        vm.prank(artisan);
        checkin.validateCheckin(alice, "artesanias-manos-oro", 75 ether);

        // Verify Alice's journey
        assertEq(token.balanceOf(alice), 325 ether);
        assertEq(nft.balanceOf(alice), 3);

        // Bob only has group visit
        assertEq(token.balanceOf(bob), 200 ether);
        assertEq(nft.balanceOf(bob), 1);
    }

    /* ============ Scenario 4: Duplicate Prevention ============ */

    function test_Scenario_CannotCheckInTwiceAtSamePlace() public {
        // First visit succeeds
        vm.prank(museum);
        checkin.validateCheckin(alice, "museo-larco", 50 ether);

        // Second visit should revert
        vm.prank(museum);
        vm.expectRevert(TravelCheckin.CheckinAlreadyRegistered.selector);
        checkin.validateCheckin(alice, "museo-larco", 50 ether);

        // Verify only one NFT was minted
        assertEq(nft.balanceOf(alice), 1);
        assertEq(token.balanceOf(alice), 50 ether);
    }

    /* ============ Scenario 5: Group with Duplicate Tourists ============ */

    function test_Scenario_GroupWithAlreadyVisitedTourists() public {
        // Alice visits solo first
        vm.prank(museum);
        checkin.validateCheckin(alice, "museo-larco", 50 ether);

        // Later, tour guide tries to check in group including Alice
        address[] memory group = new address[](3);
        group[0] = alice; // Already visited
        group[1] = bob;
        group[2] = carol;

        vm.prank(museum);
        checkin.validateGroupCheckin(group, "museo-larco", 50 ether);

        // Alice should still have only 1 NFT and 50 tokens
        assertEq(nft.balanceOf(alice), 1);
        assertEq(token.balanceOf(alice), 50 ether);

        // Bob and Carol should have their rewards
        assertEq(nft.balanceOf(bob), 1);
        assertEq(token.balanceOf(bob), 50 ether);
        assertEq(nft.balanceOf(carol), 1);
        assertEq(token.balanceOf(carol), 50 ether);
    }

    /* ============ Scenario 6: Full Tourist Journey (MVP Demo) ============ */

    function test_Scenario_CompleteVacationJourney() public {
        // Day 1: Arrive in Lima, visit cevichería
        vm.prank(artisan);
        checkin.validateCheckin(alice, "cevicheria-lima", 30 ether);

        // Day 2: Museum visit
        vm.prank(museum);
        checkin.validateCheckin(alice, "museo-larco", 50 ether);

        // Day 3: Buy artisan goods
        vm.prank(artisan);
        checkin.validateCheckin(alice, "artesanias-manos-oro", 75 ether);

        // Day 4: Join group tour to Nazca Lines
        address[] memory nazcaGroup = new address[](4);
        nazcaGroup[0] = alice;
        nazcaGroup[1] = bob;
        nazcaGroup[2] = carol;
        nazcaGroup[3] = makeAddr("david");

        vm.prank(tourGuide);
        checkin.validateGroupCheckin(nazcaGroup, "lineas-nazca", 150 ether);

        // Day 5: Machu Picchu (highlight of trip)
        vm.prank(tourGuide);
        checkin.validateGroupCheckin(nazcaGroup, "machu-picchu", 200 ether);

        // Verify Alice's complete Turi Passport
        assertEq(token.balanceOf(alice), 505 ether, "Total reputation score");
        assertEq(nft.balanceOf(alice), 5, "Should have 5 postal NFTs");

        // Verify Alice can check all visited places
        assertTrue(checkin.hasVisited(alice, "cevicheria-lima"));
        assertTrue(checkin.hasVisited(alice, "museo-larco"));
        assertTrue(checkin.hasVisited(alice, "artesanias-manos-oro"));
        assertTrue(checkin.hasVisited(alice, "lineas-nazca"));
        assertTrue(checkin.hasVisited(alice, "machu-picchu"));

        // At 505 points, Alice unlocks premium benefits (simulated)
        assertTrue(token.balanceOf(alice) >= 500 ether, "Unlocked VIP tier");
    }

    /* ============ Scenario 7: QR Code Scanning Simulation ============ */

    function test_Scenario_QRCodeScanAtMultipleLocations() public {
        // Simulate scanning QR codes at different locations
        // (In production, QR contains placeId, validator signs the transaction)

        // Scan at museum entrance
        vm.prank(museum);
        checkin.validateCheckin(alice, "museo-larco", 50 ether);

        vm.warp(block.timestamp + 2 hours);

        // Scan at artisan shop
        vm.prank(artisan);
        checkin.validateCheckin(alice, "artesanias-manos-oro", 75 ether);

        vm.warp(block.timestamp + 1 days);

        // Scan at Machu Picchu entrance
        vm.prank(tourGuide);
        checkin.validateCheckin(alice, "machu-picchu", 200 ether);

        assertEq(nft.balanceOf(alice), 3, "3 QR scans = 3 NFTs");
    }

    /* ============ Scenario 8: Multiple Tourists Same Place ============ */

    function test_Scenario_MultipleTouristsAtPopularAttraction() public {
        // Machu Picchu is popular, many tourists visit

        vm.startPrank(tourGuide);

        // Group 1
        address[] memory group1 = new address[](3);
        group1[0] = alice;
        group1[1] = bob;
        group1[2] = carol;
        checkin.validateGroupCheckin(group1, "machu-picchu", 200 ether);

        // Group 2 (different day)
        address[] memory group2 = new address[](2);
        group2[0] = makeAddr("david");
        group2[1] = makeAddr("eve");
        checkin.validateGroupCheckin(group2, "machu-picchu", 200 ether);

        vm.stopPrank();

        // Verify total NFTs minted for this place
        assertEq(nft.balanceOf(alice), 1);
        assertEq(nft.balanceOf(bob), 1);
        assertEq(nft.balanceOf(carol), 1);
        assertEq(nft.balanceOf(makeAddr("david")), 1);
        assertEq(nft.balanceOf(makeAddr("eve")), 1);

        // Verify total tokens distributed
        assertEq(token.totalSupply(), 1000 ether); // 5 tourists × 200 tokens
    }

    /* ============ Scenario 9: Invalid Addresses in Group ============ */

    function test_Scenario_GroupWithSomeInvalidAddresses() public {
        address[] memory group = new address[](5);
        group[0] = alice;
        group[1] = address(0); // Invalid
        group[2] = bob;
        group[3] = address(0); // Invalid
        group[4] = carol;

        vm.prank(tourGuide);
        checkin.validateGroupCheckin(group, "machu-picchu", 200 ether);

        // Only valid addresses should receive rewards
        assertEq(token.balanceOf(alice), 200 ether);
        assertEq(token.balanceOf(bob), 200 ether);
        assertEq(token.balanceOf(carol), 200 ether);

        // Total supply should reflect only valid check-ins
        assertEq(token.totalSupply(), 600 ether);
    }

    /* ============ Scenario 10: NFT Ownership and Transferability ============ */

    function test_Scenario_TouristCanTransferNFT() public {
        // Alice collects NFT
        vm.prank(museum);
        checkin.validateCheckin(alice, "museo-larco", 50 ether);

        uint256 tokenId = 1;
        assertEq(nft.ownerOf(tokenId), alice);

        // Alice transfers NFT to Bob (gift/sale)
        vm.prank(alice);
        nft.transferFrom(alice, bob, tokenId);

        assertEq(nft.ownerOf(tokenId), bob);
        assertEq(nft.balanceOf(alice), 0);
        assertEq(nft.balanceOf(bob), 1);

        // Reputation tokens remain with Alice (non-transferable in concept)
        assertEq(token.balanceOf(alice), 50 ether);
    }

    /* ============ Scenario 11: Gas Efficiency - Maximum Group Size ============ */

    function test_Scenario_MaximumGroupSize() public {
        address[] memory maxGroup = new address[](10);

        for (uint256 i = 0; i < 10; i++) {
            maxGroup[i] = makeAddr(
                string(abi.encodePacked("tourist", vm.toString(i)))
            );
        }

        uint256 gasBefore = gasleft();

        vm.prank(tourGuide);
        checkin.validateGroupCheckin(maxGroup, "machu-picchu", 200 ether);

        uint256 gasUsed = gasBefore - gasleft();

        console.log("Gas used for 10-person group check-in:", gasUsed);

        // Verify all tourists were processed
        for (uint256 i = 0; i < 10; i++) {
            assertEq(token.balanceOf(maxGroup[i]), 200 ether);
            assertEq(nft.balanceOf(maxGroup[i]), 1);
        }
    }

    /* ============ Scenario 12: Benefits Unlocking Simulation ============ */

    function test_Scenario_UnlockBenefitTiers() public {
        // Simulate benefit tiers based on reputation score
        // 0-99: Basic
        // 100-499: Silver
        // 500-999: Gold
        // 1000+: Platinum

        vm.startPrank(tourGuide);

        // Alice starts Basic tier
        assertEq(token.balanceOf(alice), 0);

        // Visit 1: 50 tokens → Basic tier
        checkin.validateCheckin(alice, "cevicheria-lima", 50 ether);
        assertTrue(token.balanceOf(alice) < 100 ether, "Basic tier");

        // Visit 2: 100 tokens total → Silver tier
        checkin.validateCheckin(alice, "museo-larco", 50 ether);
        assertTrue(token.balanceOf(alice) >= 100 ether, "Silver tier");

        // Visits 3-4: 500 tokens total → Gold tier
        checkin.validateCheckin(alice, "artesanias-manos-oro", 200 ether);
        checkin.validateCheckin(alice, "lineas-nazca", 150 ether);
        assertEq(token.balanceOf(alice), 450 ether);
        assertTrue(token.balanceOf(alice) >= 100 ether && token.balanceOf(alice) < 500 ether, "Silver tier (not yet Gold)");

        // Visit 5: Reach Gold tier
        checkin.validateCheckin(alice, "machu-picchu", 100 ether);
        assertEq(token.balanceOf(alice), 550 ether);
        assertTrue(token.balanceOf(alice) >= 500 ether, "Gold tier unlocked");

        vm.stopPrank();
    }
}
