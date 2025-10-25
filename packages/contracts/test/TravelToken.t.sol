// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {TravelToken} from "../src/TravelToken.sol";

contract TravelTokenTest is Test {
    TravelToken public token;

    address public admin = makeAddr("admin");
    address public minter = makeAddr("minter");
    address public user = makeAddr("user");
    address public unauthorized = makeAddr("unauthorized");

    event Transfer(address indexed from, address indexed to, uint256 value);

    function setUp() public {
        vm.startPrank(admin);
        token = new TravelToken();
        token.grantRole(token.MINTER_ROLE(), minter);
        vm.stopPrank();
    }

    /* ============ Constructor Tests ============ */

    function test_Constructor_SetsNameAndSymbol() public view {
        assertEq(token.name(), "Travel Reputation Token");
        assertEq(token.symbol(), "TRVL");
    }

    function test_Constructor_GrantsAdminRole() public view {
        assertTrue(token.hasRole(token.DEFAULT_ADMIN_ROLE(), admin));
    }

    /* ============ Mint Tests ============ */

    function test_Mint_Success() public {
        uint256 amount = 100 ether;

        vm.expectEmit(true, true, false, true);
        emit Transfer(address(0), user, amount);

        vm.prank(minter);
        token.mint(user, amount);

        assertEq(token.balanceOf(user), amount);
    }

    function test_Mint_RevertsWhen_CallerIsNotMinter() public {
        vm.prank(unauthorized);
        vm.expectRevert();
        token.mint(user, 100 ether);
    }

    function test_Mint_RevertsWhen_MintingToZeroAddress() public {
        vm.prank(minter);
        vm.expectRevert();
        token.mint(address(0), 100 ether);
    }

    function test_Mint_CanMintMultipleTimes() public {
        vm.startPrank(minter);

        token.mint(user, 50 ether);
        assertEq(token.balanceOf(user), 50 ether);

        token.mint(user, 75 ether);
        assertEq(token.balanceOf(user), 125 ether);

        vm.stopPrank();
    }

    function testFuzz_Mint_AccumulatesBalance(
        uint256 amount1,
        uint256 amount2
    ) public {
        // Bound amounts to prevent overflow
        amount1 = bound(amount1, 0, type(uint128).max);
        amount2 = bound(amount2, 0, type(uint128).max);

        vm.startPrank(minter);
        token.mint(user, amount1);
        token.mint(user, amount2);
        vm.stopPrank();

        assertEq(token.balanceOf(user), amount1 + amount2);
    }

    /* ============ Access Control Tests ============ */

    function test_AccessControl_AdminCanGrantMinterRole() public {
        address newMinter = makeAddr("newMinter");

        bytes32 adminRole = token.DEFAULT_ADMIN_ROLE();
        bytes32 minterRole = token.MINTER_ROLE();

        vm.prank(admin);
        token.grantRole(minterRole, newMinter);

        assertTrue(token.hasRole(minterRole, newMinter));
    }

    function test_AccessControl_NonAdminCannotGrantMinterRole() public {
        address newMinter = makeAddr("newMinter");
        bytes32 minterRole = token.MINTER_ROLE();
        bytes32 adminRole = token.DEFAULT_ADMIN_ROLE();

        vm.prank(unauthorized);
        vm.expectRevert(
            abi.encodeWithSignature(
                "AccessControlUnauthorizedAccount(address,bytes32)",
                unauthorized,
                adminRole
            )
        );
        token.grantRole(minterRole, newMinter);
    }

    function test_AccessControl_AdminCanRevokeMinterRole() public {
        bytes32 minterRole = token.MINTER_ROLE();

        vm.prank(admin);
        token.revokeRole(minterRole, minter);

        assertFalse(token.hasRole(minterRole, minter));
    }

    /* ============ ERC20 Standard Tests ============ */

    function test_Transfer_WorksAfterMinting() public {
        uint256 amount = 100 ether;

        vm.prank(minter);
        token.mint(user, amount);

        vm.prank(user);
        token.transfer(unauthorized, 30 ether);

        assertEq(token.balanceOf(user), 70 ether);
        assertEq(token.balanceOf(unauthorized), 30 ether);
    }

    function test_TotalSupply_IncreasesWithMints() public {
        vm.startPrank(minter);

        token.mint(user, 100 ether);
        assertEq(token.totalSupply(), 100 ether);

        token.mint(makeAddr("user2"), 50 ether);
        assertEq(token.totalSupply(), 150 ether);

        vm.stopPrank();
    }
}
