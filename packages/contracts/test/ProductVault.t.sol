// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {ProductVault} from "../src/ProductVault.sol";
import {USDX} from "../src/USDX.sol";
import {TravelToken} from "../src/TravelToken.sol";

contract ProductVaultTest is Test {
    ProductVault public vault;
    USDX public usdx;
    TravelToken public travelToken;

    address public admin = makeAddr("admin");
    address public manager = makeAddr("manager");
    address public feeRecipient = makeAddr("feeRecipient");
    address public buyer = makeAddr("buyer");
    address public sellerWallet = makeAddr("sellerWallet");
    address public unauthorized = makeAddr("unauthorized");

    uint256 public constant FEE_PERCENTAGE = 250; // 2.5%
    uint256 public constant INITIAL_USDX_SUPPLY = 1_000_000 * 10**6;

    string public constant SELLER_ID = "seller-001";
    string public constant PRODUCT_ID = "product-001";

    // Events
    event SellerRegistered(string indexed sellerId, address indexed wallet);
    event SellerUpdated(string indexed sellerId, address indexed newWallet, bool active);
    event FeeConfigUpdated(address indexed newFeeRecipient, uint256 newFeePercentage);
    event ProductPurchased(
        address indexed buyer,
        string indexed sellerId,
        string indexed productId,
        uint256 totalAmount,
        uint256 sellerAmount,
        uint256 feeAmount,
        uint256 travelTokensBurned,
        uint256 timestamp
    );

    function setUp() public {
        // Deploy tokens
        vm.prank(admin);
        usdx = new USDX(INITIAL_USDX_SUPPLY);

        vm.prank(admin);
        travelToken = new TravelToken();

        // Deploy vault
        vm.prank(admin);
        vault = new ProductVault(
            address(usdx),
            address(travelToken),
            feeRecipient,
            FEE_PERCENTAGE
        );

        // Setup roles
        vm.startPrank(admin);
        vault.grantRole(vault.MANAGER_ROLE(), manager);
        travelToken.grantRole(travelToken.MINTER_ROLE(), admin);
        vm.stopPrank();

        // Give buyer some USDX and TravelTokens
        vm.prank(admin);
        usdx.transfer(buyer, 10_000 * 10**6); // 10k USDX

        vm.prank(admin);
        travelToken.mint(buyer, 1000 ether); // 1000 TRVL
    }

    /* ============ Constructor Tests ============ */

    function test_Constructor_SetsTokenAddresses() public view {
        assertEq(address(vault.usdxToken()), address(usdx));
        assertEq(address(vault.travelToken()), address(travelToken));
    }

    function test_Constructor_SetsFeeConfig() public view {
        assertEq(vault.feeRecipient(), feeRecipient);
        assertEq(vault.feePercentage(), FEE_PERCENTAGE);
    }

    function test_Constructor_GrantsRoles() public view {
        assertTrue(vault.hasRole(vault.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(vault.hasRole(vault.MANAGER_ROLE(), admin));
    }

    function test_Constructor_RevertsWhen_InvalidUSDXAddress() public {
        vm.expectRevert(ProductVault.InvalidAddress.selector);
        new ProductVault(address(0), address(travelToken), feeRecipient, FEE_PERCENTAGE);
    }

    function test_Constructor_RevertsWhen_InvalidTravelTokenAddress() public {
        vm.expectRevert(ProductVault.InvalidAddress.selector);
        new ProductVault(address(usdx), address(0), feeRecipient, FEE_PERCENTAGE);
    }

    function test_Constructor_RevertsWhen_InvalidFeeRecipient() public {
        vm.expectRevert(ProductVault.InvalidAddress.selector);
        new ProductVault(address(usdx), address(travelToken), address(0), FEE_PERCENTAGE);
    }

    function test_Constructor_RevertsWhen_FeePercentageTooHigh() public {
        vm.expectRevert(ProductVault.InvalidFeePercentage.selector);
        new ProductVault(address(usdx), address(travelToken), feeRecipient, 1001); // > 10%
    }

    /* ============ Fee Configuration Tests ============ */

    function test_SetFeeConfig_Success() public {
        address newFeeRecipient = makeAddr("newFeeRecipient");
        uint256 newFeePercentage = 500; // 5%

        vm.expectEmit(true, false, false, true);
        emit FeeConfigUpdated(newFeeRecipient, newFeePercentage);

        vm.prank(admin);
        vault.setFeeConfig(newFeeRecipient, newFeePercentage);

        assertEq(vault.feeRecipient(), newFeeRecipient);
        assertEq(vault.feePercentage(), newFeePercentage);
    }

    function test_SetFeeConfig_RevertsWhen_NotAdmin() public {
        vm.expectRevert();
        vm.prank(unauthorized);
        vault.setFeeConfig(feeRecipient, 300);
    }

    function test_SetFeeConfig_RevertsWhen_InvalidAddress() public {
        vm.expectRevert(ProductVault.InvalidAddress.selector);
        vm.prank(admin);
        vault.setFeeConfig(address(0), 300);
    }

    function test_SetFeeConfig_RevertsWhen_FeePercentageTooHigh() public {
        vm.expectRevert(ProductVault.InvalidFeePercentage.selector);
        vm.prank(admin);
        vault.setFeeConfig(feeRecipient, 1001);
    }

    /* ============ Seller Registration Tests ============ */

    function test_RegisterSeller_Success() public {
        vm.expectEmit(true, true, false, true);
        emit SellerRegistered(SELLER_ID, sellerWallet);

        vm.prank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);

        ProductVault.Seller memory seller = vault.getSeller(SELLER_ID);
        assertEq(seller.wallet, sellerWallet);
        assertTrue(seller.active);
    }

    function test_RegisterSeller_RevertsWhen_NotManager() public {
        vm.expectRevert();
        vm.prank(unauthorized);
        vault.registerSeller(SELLER_ID, sellerWallet);
    }

    function test_RegisterSeller_RevertsWhen_EmptySellerId() public {
        vm.expectRevert(ProductVault.InvalidSellerId.selector);
        vm.prank(manager);
        vault.registerSeller("", sellerWallet);
    }

    function test_RegisterSeller_RevertsWhen_InvalidWallet() public {
        vm.expectRevert(ProductVault.InvalidAddress.selector);
        vm.prank(manager);
        vault.registerSeller(SELLER_ID, address(0));
    }

    function test_RegisterSeller_RevertsWhen_AlreadyRegistered() public {
        vm.prank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);

        vm.expectRevert(ProductVault.SellerAlreadyRegistered.selector);
        vm.prank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);
    }

    /* ============ Seller Update Tests ============ */

    function test_UpdateSeller_Success() public {
        // Register seller first
        vm.prank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);

        address newWallet = makeAddr("newSellerWallet");

        vm.expectEmit(true, true, false, true);
        emit SellerUpdated(SELLER_ID, newWallet, false);

        vm.prank(manager);
        vault.updateSeller(SELLER_ID, newWallet, false);

        ProductVault.Seller memory seller = vault.getSeller(SELLER_ID);
        assertEq(seller.wallet, newWallet);
        assertFalse(seller.active);
    }

    function test_UpdateSeller_RevertsWhen_SellerNotFound() public {
        vm.expectRevert(ProductVault.SellerNotFound.selector);
        vm.prank(manager);
        vault.updateSeller("non-existent", sellerWallet, true);
    }

    function test_UpdateSeller_RevertsWhen_InvalidWallet() public {
        vm.prank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);

        vm.expectRevert(ProductVault.InvalidAddress.selector);
        vm.prank(manager);
        vault.updateSeller(SELLER_ID, address(0), true);
    }

    /* ============ Calculate Fee Tests ============ */

    function test_CalculateFee_CorrectCalculation() public view {
        uint256 amount = 100 * 10**6; // 100 USDX
        (uint256 feeAmount, uint256 sellerAmount) = vault.calculateFee(amount);

        // 2.5% fee
        assertEq(feeAmount, 2.5 * 10**6); // 2.5 USDX
        assertEq(sellerAmount, 97.5 * 10**6); // 97.5 USDX
        assertEq(feeAmount + sellerAmount, amount);
    }

    function test_CalculateFee_ZeroAmount() public view {
        (uint256 feeAmount, uint256 sellerAmount) = vault.calculateFee(0);
        assertEq(feeAmount, 0);
        assertEq(sellerAmount, 0);
    }

    /* ============ Purchase Product Tests ============ */

    function test_PurchaseProduct_Success_WithTravelTokens() public {
        // Setup: Register seller
        vm.prank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);

        uint256 purchaseAmount = 100 * 10**6; // 100 USDX
        uint256 tokensRequired = 10 ether; // 10 TRVL

        // Calculate expected amounts
        (uint256 expectedFee, uint256 expectedSellerAmount) = vault.calculateFee(purchaseAmount);

        // Buyer approves tokens
        vm.startPrank(buyer);
        usdx.approve(address(vault), purchaseAmount);
        travelToken.approve(address(vault), tokensRequired);
        vm.stopPrank();

        // Get balances before
        uint256 buyerUsdxBefore = usdx.balanceOf(buyer);
        uint256 buyerTravelBefore = travelToken.balanceOf(buyer);
        uint256 sellerUsdxBefore = usdx.balanceOf(sellerWallet);
        uint256 feeRecipientBefore = usdx.balanceOf(feeRecipient);

        // Expect event
        vm.expectEmit(true, true, true, true);
        emit ProductPurchased(
            buyer,
            SELLER_ID,
            PRODUCT_ID,
            purchaseAmount,
            expectedSellerAmount,
            expectedFee,
            tokensRequired,
            block.timestamp
        );

        // Purchase
        vm.prank(buyer);
        vault.purchaseProduct(PRODUCT_ID, SELLER_ID, purchaseAmount, tokensRequired);

        // Verify USDX transfers
        assertEq(usdx.balanceOf(buyer), buyerUsdxBefore - purchaseAmount);
        assertEq(usdx.balanceOf(sellerWallet), sellerUsdxBefore + expectedSellerAmount);
        assertEq(usdx.balanceOf(feeRecipient), feeRecipientBefore + expectedFee);

        // Verify TravelTokens burned (sent to 0xdead)
        assertEq(travelToken.balanceOf(buyer), buyerTravelBefore - tokensRequired);
        assertEq(travelToken.balanceOf(address(0xdead)), tokensRequired);
    }

    function test_PurchaseProduct_Success_WithoutTravelTokens() public {
        // Setup: Register seller
        vm.prank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);

        uint256 purchaseAmount = 50 * 10**6; // 50 USDX
        uint256 tokensRequired = 0; // No tokens

        // Buyer approves USDX only
        vm.prank(buyer);
        usdx.approve(address(vault), purchaseAmount);

        // Get balances before
        uint256 buyerUsdxBefore = usdx.balanceOf(buyer);
        uint256 buyerTravelBefore = travelToken.balanceOf(buyer);

        // Purchase
        vm.prank(buyer);
        vault.purchaseProduct(PRODUCT_ID, SELLER_ID, purchaseAmount, tokensRequired);

        // Verify USDX transferred
        assertEq(usdx.balanceOf(buyer), buyerUsdxBefore - purchaseAmount);

        // Verify TravelTokens not touched
        assertEq(travelToken.balanceOf(buyer), buyerTravelBefore);
    }

    function test_PurchaseProduct_Success_WithZeroFee() public {
        // Setup: Set fee to 0%
        vm.prank(admin);
        vault.setFeeConfig(feeRecipient, 0);

        // Register seller
        vm.prank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);

        uint256 purchaseAmount = 100 * 10**6;

        // Approve and purchase
        vm.startPrank(buyer);
        usdx.approve(address(vault), purchaseAmount);
        vault.purchaseProduct(PRODUCT_ID, SELLER_ID, purchaseAmount, 0);
        vm.stopPrank();

        // Seller should receive full amount
        assertEq(usdx.balanceOf(sellerWallet), purchaseAmount);
        assertEq(usdx.balanceOf(feeRecipient), 0);
    }

    function test_PurchaseProduct_RevertsWhen_EmptyProductId() public {
        vm.prank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);

        vm.expectRevert(ProductVault.InvalidProductId.selector);
        vm.prank(buyer);
        vault.purchaseProduct("", SELLER_ID, 100 * 10**6, 0);
    }

    function test_PurchaseProduct_RevertsWhen_ZeroAmount() public {
        vm.prank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);

        vm.expectRevert(ProductVault.InvalidAmount.selector);
        vm.prank(buyer);
        vault.purchaseProduct(PRODUCT_ID, SELLER_ID, 0, 0);
    }

    function test_PurchaseProduct_RevertsWhen_SellerNotFound() public {
        vm.expectRevert(ProductVault.SellerNotFound.selector);
        vm.prank(buyer);
        vault.purchaseProduct(PRODUCT_ID, "non-existent", 100 * 10**6, 0);
    }

    function test_PurchaseProduct_RevertsWhen_SellerInactive() public {
        // Register and deactivate seller
        vm.startPrank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);
        vault.updateSeller(SELLER_ID, sellerWallet, false);
        vm.stopPrank();

        vm.expectRevert(ProductVault.SellerInactive.selector);
        vm.prank(buyer);
        vault.purchaseProduct(PRODUCT_ID, SELLER_ID, 100 * 10**6, 0);
    }

    function test_PurchaseProduct_RevertsWhen_InsufficientUSDXBalance() public {
        vm.prank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);

        address poorBuyer = makeAddr("poorBuyer");

        vm.expectRevert(ProductVault.InsufficientUSDXBalance.selector);
        vm.prank(poorBuyer);
        vault.purchaseProduct(PRODUCT_ID, SELLER_ID, 100 * 10**6, 0);
    }

    function test_PurchaseProduct_RevertsWhen_InsufficientUSDXAllowance() public {
        vm.prank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);

        // Don't approve
        vm.expectRevert(ProductVault.InsufficientUSDXAllowance.selector);
        vm.prank(buyer);
        vault.purchaseProduct(PRODUCT_ID, SELLER_ID, 100 * 10**6, 0);
    }

    function test_PurchaseProduct_RevertsWhen_InsufficientTravelTokens() public {
        vm.prank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);

        uint256 purchaseAmount = 100 * 10**6;
        uint256 tokensRequired = 10000 ether; // More than buyer has

        vm.startPrank(buyer);
        usdx.approve(address(vault), purchaseAmount);
        travelToken.approve(address(vault), tokensRequired);

        vm.expectRevert(ProductVault.InsufficientTravelTokens.selector);
        vault.purchaseProduct(PRODUCT_ID, SELLER_ID, purchaseAmount, tokensRequired);
        vm.stopPrank();
    }

    function test_PurchaseProduct_RevertsWhen_InsufficientTravelTokenAllowance() public {
        vm.prank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);

        uint256 purchaseAmount = 100 * 10**6;
        uint256 tokensRequired = 10 ether;

        vm.startPrank(buyer);
        usdx.approve(address(vault), purchaseAmount);
        // Don't approve travel tokens

        vm.expectRevert(ProductVault.InsufficientTravelTokenAllowance.selector);
        vault.purchaseProduct(PRODUCT_ID, SELLER_ID, purchaseAmount, tokensRequired);
        vm.stopPrank();
    }

    /* ============ View Function Tests ============ */

    function test_GetSeller_ReturnsCorrectData() public {
        vm.prank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);

        ProductVault.Seller memory seller = vault.getSeller(SELLER_ID);
        assertEq(seller.wallet, sellerWallet);
        assertTrue(seller.active);
    }

    function test_GetSeller_ReturnsZeroForNonExistent() public view {
        ProductVault.Seller memory seller = vault.getSeller("non-existent");
        assertEq(seller.wallet, address(0));
        assertFalse(seller.active);
    }

    function test_IsSellerActive_ReturnsTrue() public {
        vm.prank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);

        assertTrue(vault.isSellerActive(SELLER_ID));
    }

    function test_IsSellerActive_ReturnsFalse_WhenDeactivated() public {
        vm.startPrank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);
        vault.updateSeller(SELLER_ID, sellerWallet, false);
        vm.stopPrank();

        assertFalse(vault.isSellerActive(SELLER_ID));
    }

    function test_IsSellerActive_ReturnsFalse_WhenNotRegistered() public view {
        assertFalse(vault.isSellerActive("non-existent"));
    }

    /* ============ Integration Tests ============ */

    function test_Integration_MultiplePurchases() public {
        // Register seller
        vm.prank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);

        uint256 numPurchases = 5;
        uint256 purchaseAmount = 20 * 10**6; // 20 USDX each

        uint256 totalExpected = numPurchases * purchaseAmount;
        (uint256 feePerPurchase, uint256 sellerPerPurchase) = vault.calculateFee(purchaseAmount);

        // Approve total amount
        vm.prank(buyer);
        usdx.approve(address(vault), totalExpected);

        // Make multiple purchases
        for (uint i = 0; i < numPurchases; i++) {
            vm.prank(buyer);
            vault.purchaseProduct(
                string(abi.encodePacked("product-", vm.toString(i))),
                SELLER_ID,
                purchaseAmount,
                0
            );
        }

        // Verify totals
        assertEq(
            usdx.balanceOf(sellerWallet),
            sellerPerPurchase * numPurchases
        );
        assertEq(
            usdx.balanceOf(feeRecipient),
            feePerPurchase * numPurchases
        );
    }

    function test_Integration_DifferentFeePercentages() public {
        vm.prank(manager);
        vault.registerSeller(SELLER_ID, sellerWallet);

        uint256 purchaseAmount = 100 * 10**6;

        // Test with different fee percentages
        uint256[4] memory feePercentages = [uint256(0), uint256(100), uint256(500), uint256(1000)];

        for (uint i = 0; i < feePercentages.length; i++) {
            // Update fee
            vm.prank(admin);
            vault.setFeeConfig(feeRecipient, feePercentages[i]);

            // Approve and purchase
            vm.startPrank(buyer);
            usdx.approve(address(vault), purchaseAmount);
            vault.purchaseProduct(
                string(abi.encodePacked("product-fee-", vm.toString(i))),
                SELLER_ID,
                purchaseAmount,
                0
            );
            vm.stopPrank();

            // Verify fee calculation
            (uint256 expectedFee, uint256 expectedSeller) = vault.calculateFee(purchaseAmount);
            assertEq(expectedFee, (purchaseAmount * feePercentages[i]) / 10000);
            assertEq(expectedSeller, purchaseAmount - expectedFee);
        }
    }
}
