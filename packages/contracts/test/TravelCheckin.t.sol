// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {TravelCheckin} from "../src/TravelCheckin.sol";
import {TravelToken} from "../src/TravelToken.sol";
import {PlaceNFT} from "../src/PlaceNFT.sol";

contract TravelCheckinTest is Test {
    TravelCheckin public checkin;
    TravelToken public token;
    PlaceNFT public nft;

    address public admin = makeAddr("admin");
    address public validator = makeAddr("validator");
    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");
    address public unauthorized = makeAddr("unauthorized");

    string constant PLACE_ID = "machu-picchu";
    string constant PLACE_NAME = "Machu Picchu";
    string constant METADATA_URI = "ipfs://QmTest123";
    uint256 constant REWARD = 100 ether;

    event CheckinCompleted(
        address indexed user,
        bytes32 indexed placeHash,
        string placeId,
        uint256 reward,
        uint256 nftId,
        uint256 timestamp
    );

    event CheckinSkipped(
        address indexed user,
        bytes32 indexed placeHash,
        TravelCheckin.SkipReason reason
    );

    function setUp() public {
        vm.startPrank(admin);

        // Deploy contracts
        token = new TravelToken();
        nft = new PlaceNFT();
        checkin = new TravelCheckin(address(token), address(nft));

        // Setup roles
        token.grantRole(token.MINTER_ROLE(), address(checkin));
        nft.grantRole(nft.MINTER_ROLE(), address(checkin));
        checkin.grantRole(checkin.VALIDATOR_ROLE(), validator);

        // Register a place
        nft.registerPlace(PLACE_ID, PLACE_NAME, METADATA_URI);

        vm.stopPrank();
    }

    /* ============ Constructor Tests ============ */

    function test_Constructor_SetsContracts() public view {
        assertEq(address(checkin.tokenContract()), address(token));
        assertEq(address(checkin.placeNFT()), address(nft));
    }

    function test_Constructor_GrantsAdminRole() public view {
        assertTrue(checkin.hasRole(checkin.DEFAULT_ADMIN_ROLE(), admin));
    }

    /* ============ Add Validator Tests ============ */

    function test_AddValidator_Success() public {
        address newValidator = makeAddr("newValidator");

        vm.prank(admin);
        checkin.addValidator(newValidator);

        assertTrue(checkin.hasRole(checkin.VALIDATOR_ROLE(), newValidator));
    }

    function test_AddValidator_RevertsWhen_CallerIsNotAdmin() public {
        vm.prank(unauthorized);
        vm.expectRevert();
        checkin.addValidator(unauthorized);
    }

    /* ============ HasVisited Tests ============ */

    function test_HasVisited_ReturnsFalse_BeforeCheckin() public view {
        assertFalse(checkin.hasVisited(user1, PLACE_ID));
    }

    function test_HasVisited_ReturnsTrue_AfterCheckin() public {
        vm.prank(validator);
        checkin.validateCheckin(user1, PLACE_ID, REWARD);

        assertTrue(checkin.hasVisited(user1, PLACE_ID));
    }

    /* ============ ValidateCheckin Tests ============ */

    function test_ValidateCheckin_Success() public {
        bytes32 placeHash = keccak256(abi.encodePacked(PLACE_ID));

        vm.expectEmit(true, true, false, true);
        emit CheckinCompleted(
            user1,
            placeHash,
            PLACE_ID,
            REWARD,
            1,
            block.timestamp
        );

        vm.prank(validator);
        checkin.validateCheckin(user1, PLACE_ID, REWARD);

        // Verify state changes
        assertTrue(checkin.hasVisited(user1, PLACE_ID));
        assertEq(token.balanceOf(user1), REWARD);
        assertEq(nft.balanceOf(user1), 1);
        assertEq(nft.ownerOf(1), user1);
    }

    function test_ValidateCheckin_RevertsWhen_AlreadyCheckedIn() public {
        vm.startPrank(validator);

        checkin.validateCheckin(user1, PLACE_ID, REWARD);

        vm.expectRevert(TravelCheckin.CheckinAlreadyRegistered.selector);
        checkin.validateCheckin(user1, PLACE_ID, REWARD);

        vm.stopPrank();
    }

    function test_ValidateCheckin_RevertsWhen_CallerIsNotValidator() public {
        vm.prank(unauthorized);
        vm.expectRevert();
        checkin.validateCheckin(user1, PLACE_ID, REWARD);
    }

    function test_ValidateCheckin_RevertsWhen_PlaceNotRegistered() public {
        vm.prank(validator);
        vm.expectRevert(PlaceNFT.PlaceInactiveOrNotRegistered.selector);
        checkin.validateCheckin(user1, "unregistered-place", REWARD);
    }

    function test_ValidateCheckin_AllowsMultiplePlacesPerUser() public {
        // Register second place
        vm.prank(admin);
        nft.registerPlace("cusco", "Cusco", "ipfs://QmCusco");

        vm.startPrank(validator);

        checkin.validateCheckin(user1, PLACE_ID, REWARD);
        checkin.validateCheckin(user1, "cusco", REWARD);

        vm.stopPrank();

        assertTrue(checkin.hasVisited(user1, PLACE_ID));
        assertTrue(checkin.hasVisited(user1, "cusco"));
        assertEq(token.balanceOf(user1), REWARD * 2);
        assertEq(nft.balanceOf(user1), 2);
    }

    function test_ValidateCheckin_AllowsSamePlaceForDifferentUsers() public {
        vm.startPrank(validator);

        checkin.validateCheckin(user1, PLACE_ID, REWARD);
        checkin.validateCheckin(user2, PLACE_ID, REWARD);

        vm.stopPrank();

        assertTrue(checkin.hasVisited(user1, PLACE_ID));
        assertTrue(checkin.hasVisited(user2, PLACE_ID));
        assertEq(token.balanceOf(user1), REWARD);
        assertEq(token.balanceOf(user2), REWARD);
    }

    /* ============ ValidateGroupCheckin Tests ============ */

    function test_ValidateGroupCheckin_Success() public {
        address[] memory users = new address[](3);
        users[0] = user1;
        users[1] = user2;
        users[2] = makeAddr("user3");

        vm.prank(validator);
        checkin.validateGroupCheckin(users, PLACE_ID, REWARD);

        // Verify all users received tokens and NFTs
        for (uint256 i = 0; i < users.length; i++) {
            assertTrue(checkin.hasVisited(users[i], PLACE_ID));
            assertEq(token.balanceOf(users[i]), REWARD);
            assertEq(nft.balanceOf(users[i]), 1);
        }
    }

    function test_ValidateGroupCheckin_SkipsInvalidAddress() public {
        address[] memory users = new address[](3);
        users[0] = user1;
        users[1] = address(0); // Invalid
        users[2] = user2;

        bytes32 placeHash = keccak256(abi.encodePacked(PLACE_ID));

        vm.expectEmit(true, true, false, true);
        emit CheckinSkipped(
            address(0),
            placeHash,
            TravelCheckin.SkipReason.InvalidAddress
        );

        vm.prank(validator);
        checkin.validateGroupCheckin(users, PLACE_ID, REWARD);

        // Verify valid users were processed
        assertTrue(checkin.hasVisited(user1, PLACE_ID));
        assertTrue(checkin.hasVisited(user2, PLACE_ID));

        // Verify invalid address was skipped
        assertFalse(checkin.hasVisited(address(0), PLACE_ID));
    }

    function test_ValidateGroupCheckin_SkipsAlreadyCheckedIn() public {
        // First check-in for user1
        vm.prank(validator);
        checkin.validateCheckin(user1, PLACE_ID, REWARD);

        // Try group check-in with user1 included
        address[] memory users = new address[](2);
        users[0] = user1; // Already checked in
        users[1] = user2;

        bytes32 placeHash = keccak256(abi.encodePacked(PLACE_ID));

        vm.expectEmit(true, true, false, true);
        emit CheckinSkipped(
            user1,
            placeHash,
            TravelCheckin.SkipReason.AlreadyCheckedIn
        );

        vm.prank(validator);
        checkin.validateGroupCheckin(users, PLACE_ID, REWARD);

        // Verify user1 still has only 1 NFT (not 2)
        assertEq(nft.balanceOf(user1), 1);
        assertEq(token.balanceOf(user1), REWARD);

        // Verify user2 was processed
        assertTrue(checkin.hasVisited(user2, PLACE_ID));
        assertEq(nft.balanceOf(user2), 1);
    }

    function test_ValidateGroupCheckin_RevertsWhen_EmptyArray() public {
        address[] memory users = new address[](0);

        vm.prank(validator);
        vm.expectRevert(TravelCheckin.hasToBeMoreThanZero.selector);
        checkin.validateGroupCheckin(users, PLACE_ID, REWARD);
    }

    function test_ValidateGroupCheckin_RevertsWhen_ExceedsMaxUsers() public {
        address[] memory users = new address[](11); // Max is 10

        for (uint256 i = 0; i < 11; i++) {
            users[i] = makeAddr(string(abi.encodePacked("user", i)));
        }

        vm.prank(validator);
        vm.expectRevert(TravelCheckin.hasToBeLessThanMaxUsers.selector);
        checkin.validateGroupCheckin(users, PLACE_ID, REWARD);
    }

    function test_ValidateGroupCheckin_RevertsWhen_CallerIsNotValidator()
        public
    {
        address[] memory users = new address[](1);
        users[0] = user1;

        vm.prank(unauthorized);
        vm.expectRevert();
        checkin.validateGroupCheckin(users, PLACE_ID, REWARD);
    }

    function test_ValidateGroupCheckin_ProcessesExactly10Users() public {
        address[] memory users = new address[](10);

        for (uint256 i = 0; i < 10; i++) {
            users[i] = makeAddr(string(abi.encodePacked("user", i)));
        }

        vm.prank(validator);
        checkin.validateGroupCheckin(users, PLACE_ID, REWARD);

        // Verify all users were processed
        for (uint256 i = 0; i < 10; i++) {
            assertTrue(checkin.hasVisited(users[i], PLACE_ID));
            assertEq(token.balanceOf(users[i]), REWARD);
        }
    }

    function test_ValidateGroupCheckin_MixedValidAndInvalidAddresses() public {
        address[] memory users = new address[](5);
        users[0] = user1;
        users[1] = address(0); // Invalid
        users[2] = user2;
        users[3] = address(0); // Invalid
        users[4] = makeAddr("user3");

        vm.prank(validator);
        checkin.validateGroupCheckin(users, PLACE_ID, REWARD);

        // Verify valid users (3) were processed
        assertTrue(checkin.hasVisited(user1, PLACE_ID));
        assertTrue(checkin.hasVisited(user2, PLACE_ID));
        assertTrue(checkin.hasVisited(makeAddr("user3"), PLACE_ID));

        // Verify total supply
        assertEq(token.totalSupply(), REWARD * 3);
    }

    /* ============ Integration Tests ============ */

    function test_Integration_MultipleValidatorsMultiplePlaces() public {
        address validator2 = makeAddr("validator2");

        vm.startPrank(admin);
        checkin.addValidator(validator2);
        nft.registerPlace("cusco", "Cusco", "ipfs://QmCusco");
        nft.registerPlace("lima", "Lima", "ipfs://QmLima");
        vm.stopPrank();

        // Validator 1 processes Machu Picchu
        vm.prank(validator);
        checkin.validateCheckin(user1, PLACE_ID, 100 ether);

        // Validator 2 processes Cusco
        vm.prank(validator2);
        checkin.validateCheckin(user1, "cusco", 50 ether);

        // User 1 processes Lima themselves (if they're also a validator)
        vm.prank(admin);
        checkin.addValidator(user1);

        vm.prank(user1);
        checkin.validateCheckin(user1, "lima", 75 ether);

        // Verify totals
        assertEq(token.balanceOf(user1), 225 ether);
        assertEq(nft.balanceOf(user1), 3);
        assertTrue(checkin.hasVisited(user1, PLACE_ID));
        assertTrue(checkin.hasVisited(user1, "cusco"));
        assertTrue(checkin.hasVisited(user1, "lima"));
    }

    function test_Integration_GroupCheckinWithSubsequentIndividualCheckin()
        public
    {
        // Group check-in
        address[] memory users = new address[](2);
        users[0] = user1;
        users[1] = user2;

        vm.prank(validator);
        checkin.validateGroupCheckin(users, PLACE_ID, REWARD);

        // Register new place
        vm.prank(admin);
        nft.registerPlace("cusco", "Cusco", "ipfs://QmCusco");

        // Individual check-in for user1 at new place
        vm.prank(validator);
        checkin.validateCheckin(user1, "cusco", REWARD);

        // Verify user1 has 2 NFTs
        assertEq(nft.balanceOf(user1), 2);
        assertEq(token.balanceOf(user1), REWARD * 2);

        // Verify user2 has 1 NFT
        assertEq(nft.balanceOf(user2), 1);
        assertEq(token.balanceOf(user2), REWARD);
    }

    /* ============ Fuzz Tests ============ */

    function testFuzz_ValidateCheckin_WithDifferentRewards(
        uint256 reward
    ) public {
        reward = bound(reward, 1, type(uint128).max);

        vm.prank(validator);
        checkin.validateCheckin(user1, PLACE_ID, reward);

        assertEq(token.balanceOf(user1), reward);
    }

    function testFuzz_HasVisited_WithDifferentPlaceIds(
        string memory placeId
    ) public {
        vm.assume(bytes(placeId).length > 0);
        vm.assume(bytes(placeId).length < 100);

        // Register place
        vm.prank(admin);
        nft.registerPlace(placeId, "Test Place", "ipfs://test");

        // Check-in
        vm.prank(validator);
        checkin.validateCheckin(user1, placeId, REWARD);

        assertTrue(checkin.hasVisited(user1, placeId));
    }
}
