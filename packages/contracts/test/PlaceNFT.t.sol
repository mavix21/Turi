// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {PlaceNFT} from "../src/PlaceNFT.sol";

contract PlaceNFTTest is Test {
    PlaceNFT public nft;

    address public admin = makeAddr("admin");
    address public minter = makeAddr("minter");
    address public user = makeAddr("user");
    address public unauthorized = makeAddr("unauthorized");

    string constant PLACE_ID = "machu-picchu";
    string constant PLACE_NAME = "Machu Picchu";
    string constant METADATA_URI = "ipfs://QmTest123";

    event PlaceRegistered(string placeId, string name, string metadataURI);
    event PlaceNFTMinted(address indexed to, string placeId, uint256 tokenId);

    function setUp() public {
        vm.startPrank(admin);
        nft = new PlaceNFT();
        nft.grantRole(nft.MINTER_ROLE(), minter);
        vm.stopPrank();
    }

    /* ============ Constructor Tests ============ */

    function test_Constructor_SetsNameAndSymbol() public view {
        assertEq(nft.name(), "PlaceNFT");
        assertEq(nft.symbol(), "PLCNFT");
    }

    function test_Constructor_GrantsAdminRole() public view {
        assertTrue(nft.hasRole(nft.DEFAULT_ADMIN_ROLE(), admin));
    }

    /* ============ Register Place Tests ============ */

    function test_RegisterPlace_Success() public {
        vm.expectEmit(false, false, false, true);
        emit PlaceRegistered(PLACE_ID, PLACE_NAME, METADATA_URI);

        vm.prank(admin);
        nft.registerPlace(PLACE_ID, PLACE_NAME, METADATA_URI);

        (
            string memory placeId,
            string memory name,
            string memory uri,
            bool active
        ) = nft.places(PLACE_ID);

        assertEq(placeId, PLACE_ID);
        assertEq(name, PLACE_NAME);
        assertEq(uri, METADATA_URI);
        assertTrue(active);
    }

    function test_RegisterPlace_RevertsWhen_AlreadyRegistered() public {
        vm.startPrank(admin);
        nft.registerPlace(PLACE_ID, PLACE_NAME, METADATA_URI);

        vm.expectRevert(PlaceNFT.PlaceAlreadyRegistered.selector);
        nft.registerPlace(PLACE_ID, PLACE_NAME, METADATA_URI);
        vm.stopPrank();
    }

    function test_RegisterPlace_RevertsWhen_CallerIsNotAdmin() public {
        vm.prank(unauthorized);
        vm.expectRevert();
        nft.registerPlace(PLACE_ID, PLACE_NAME, METADATA_URI);
    }

    function test_RegisterPlace_CanRegisterMultiplePlaces() public {
        vm.startPrank(admin);

        nft.registerPlace("cusco", "Cusco", "ipfs://QmCusco");
        nft.registerPlace("lima", "Lima", "ipfs://QmLima");

        vm.stopPrank();

        (, , , bool active1) = nft.places("cusco");
        (, , , bool active2) = nft.places("lima");

        assertTrue(active1);
        assertTrue(active2);
    }

    /* ============ Mint NFT Tests ============ */

    function test_MintPlaceNFT_Success() public {
        // Register place first
        vm.prank(admin);
        nft.registerPlace(PLACE_ID, PLACE_NAME, METADATA_URI);

        // Mint NFT
        vm.expectEmit(true, false, false, true);
        emit PlaceNFTMinted(user, PLACE_ID, 1);

        vm.prank(minter);
        uint256 tokenId = nft.mintPlaceNFT(user, PLACE_ID);

        assertEq(tokenId, 1);
        assertEq(nft.ownerOf(tokenId), user);
        assertEq(nft.tokenURI(tokenId), METADATA_URI);
        assertEq(nft.balanceOf(user), 1);
    }

    function test_MintPlaceNFT_RevertsWhen_PlaceNotRegistered() public {
        vm.prank(minter);
        vm.expectRevert(PlaceNFT.PlaceInactiveOrNotRegistered.selector);
        nft.mintPlaceNFT(user, "unregistered-place");
    }

    function test_MintPlaceNFT_RevertsWhen_CallerIsNotMinter() public {
        vm.prank(admin);
        nft.registerPlace(PLACE_ID, PLACE_NAME, METADATA_URI);

        vm.prank(unauthorized);
        vm.expectRevert();
        nft.mintPlaceNFT(user, PLACE_ID);
    }

    function test_MintPlaceNFT_CanMintMultipleToSameUser() public {
        // Register multiple places
        vm.startPrank(admin);
        nft.registerPlace("place1", "Place 1", "ipfs://1");
        nft.registerPlace("place2", "Place 2", "ipfs://2");
        vm.stopPrank();

        // Mint multiple NFTs to same user
        vm.startPrank(minter);
        uint256 tokenId1 = nft.mintPlaceNFT(user, "place1");
        uint256 tokenId2 = nft.mintPlaceNFT(user, "place2");
        vm.stopPrank();

        assertEq(nft.balanceOf(user), 2);
        assertEq(nft.ownerOf(tokenId1), user);
        assertEq(nft.ownerOf(tokenId2), user);
    }

    function test_MintPlaceNFT_CanMintSamePlaceToDifferentUsers() public {
        vm.prank(admin);
        nft.registerPlace(PLACE_ID, PLACE_NAME, METADATA_URI);

        address user2 = makeAddr("user2");

        vm.startPrank(minter);
        uint256 tokenId1 = nft.mintPlaceNFT(user, PLACE_ID);
        uint256 tokenId2 = nft.mintPlaceNFT(user2, PLACE_ID);
        vm.stopPrank();

        assertEq(nft.ownerOf(tokenId1), user);
        assertEq(nft.ownerOf(tokenId2), user2);
        assertEq(nft.tokenURI(tokenId1), METADATA_URI);
        assertEq(nft.tokenURI(tokenId2), METADATA_URI);
    }

    function test_MintPlaceNFT_IncrementsTokenId() public {
        vm.prank(admin);
        nft.registerPlace(PLACE_ID, PLACE_NAME, METADATA_URI);

        vm.startPrank(minter);
        uint256 tokenId1 = nft.mintPlaceNFT(user, PLACE_ID);
        uint256 tokenId2 = nft.mintPlaceNFT(user, PLACE_ID);
        uint256 tokenId3 = nft.mintPlaceNFT(user, PLACE_ID);
        vm.stopPrank();

        assertEq(tokenId1, 1);
        assertEq(tokenId2, 2);
        assertEq(tokenId3, 3);
    }

    /* ============ ERC721 Standard Tests ============ */

    function test_Transfer_WorksAfterMinting() public {
        vm.prank(admin);
        nft.registerPlace(PLACE_ID, PLACE_NAME, METADATA_URI);

        vm.prank(minter);
        uint256 tokenId = nft.mintPlaceNFT(user, PLACE_ID);

        address recipient = makeAddr("recipient");

        vm.prank(user);
        nft.transferFrom(user, recipient, tokenId);

        assertEq(nft.ownerOf(tokenId), recipient);
        assertEq(nft.balanceOf(user), 0);
        assertEq(nft.balanceOf(recipient), 1);
    }

    function test_Approve_WorksCorrectly() public {
        vm.prank(admin);
        nft.registerPlace(PLACE_ID, PLACE_NAME, METADATA_URI);

        vm.prank(minter);
        uint256 tokenId = nft.mintPlaceNFT(user, PLACE_ID);

        address approvedAddress = makeAddr("approved");

        vm.prank(user);
        nft.approve(approvedAddress, tokenId);

        assertEq(nft.getApproved(tokenId), approvedAddress);
    }

    /* ============ Access Control Tests ============ */

    function test_AccessControl_AdminCanGrantMinterRole() public {
        address newMinter = makeAddr("newMinter");
        bytes32 minterRole = nft.MINTER_ROLE();

        vm.prank(admin);
        nft.grantRole(minterRole, newMinter);

        assertTrue(nft.hasRole(minterRole, newMinter));
    }

    function test_AccessControl_NonAdminCannotGrantMinterRole() public {
        address newMinter = makeAddr("newMinter");
        bytes32 minterRole = nft.MINTER_ROLE();
        bytes32 adminRole = nft.DEFAULT_ADMIN_ROLE();

        vm.prank(unauthorized);
        vm.expectRevert(
            abi.encodeWithSignature(
                "AccessControlUnauthorizedAccount(address,bytes32)",
                unauthorized,
                adminRole
            )
        );
        nft.grantRole(minterRole, newMinter);
    }

    /* ============ Edge Cases ============ */

    function test_MintPlaceNFT_RevertsWhen_MintingToZeroAddress() public {
        vm.prank(admin);
        nft.registerPlace(PLACE_ID, PLACE_NAME, METADATA_URI);

        vm.prank(minter);
        vm.expectRevert();
        nft.mintPlaceNFT(address(0), PLACE_ID);
    }

    function testFuzz_RegisterPlace_WithDifferentInputs(
        string memory placeId,
        string memory placeName,
        string memory uri
    ) public {
        // Skip empty strings
        vm.assume(bytes(placeId).length > 0);

        vm.prank(admin);
        nft.registerPlace(placeId, placeName, uri);

        (
            string memory storedId,
            string memory storedName,
            string memory storedUri,
            bool active
        ) = nft.places(placeId);

        assertEq(storedId, placeId);
        assertEq(storedName, placeName);
        assertEq(storedUri, uri);
        assertTrue(active);
    }
}
