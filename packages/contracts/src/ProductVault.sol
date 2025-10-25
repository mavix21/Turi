// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title ProductVault
/// @notice Sistema de compra de productos turísticos usando USDX + quema de TravelTokens
/// @dev Los productos se almacenan off-chain, este contrato solo procesa pagos y emite eventos
/// @dev Sin storage de compras - usa eventos para indexación off-chain (gas-efficient)
contract ProductVault is AccessControl, ReentrancyGuard {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    IERC20 public immutable usdxToken;
    IERC20 public immutable travelToken;

    /// @notice Wallet que recibe las comisiones del protocolo
    address public feeRecipient;

    /// @notice Porcentaje de comisión en basis points (100 = 1%, 250 = 2.5%, 10000 = 100%)
    uint256 public feePercentage;

    /// @notice Máxima comisión permitida (10% = 1000 basis points)
    uint256 public constant MAX_FEE_PERCENTAGE = 1000;

    struct Seller {
        address wallet;
        bool active;
    }

    // Mapeos
    mapping(string => Seller) public sellers; // sellerId => Seller

    // Eventos
    event SellerRegistered(string indexed sellerId, address indexed wallet);
    event SellerUpdated(string indexed sellerId, address indexed newWallet, bool active);
    event FeeConfigUpdated(address indexed newFeeRecipient, uint256 newFeePercentage);

    /// @notice Evento principal de compra - indexar este evento para obtener historial
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

    // Errores
    error SellerNotFound();
    error SellerInactive();
    error SellerAlreadyRegistered();
    error InvalidAmount();
    error InvalidAddress();
    error InvalidSellerId();
    error InvalidProductId();
    error InvalidFeePercentage();
    error InsufficientUSDXBalance();
    error InsufficientTravelTokens();
    error InsufficientUSDXAllowance();
    error InsufficientTravelTokenAllowance();
    error TransferFailed();

    /// @notice Constructor del contrato
    /// @param _usdxToken Dirección del token USDX (stablecoin)
    /// @param _travelToken Dirección del token TravelToken (puntos de recompensa)
    /// @param _feeRecipient Wallet que recibirá las comisiones
    /// @param _feePercentage Porcentaje de comisión en basis points (250 = 2.5%)
    constructor(
        address _usdxToken,
        address _travelToken,
        address _feeRecipient,
        uint256 _feePercentage
    ) {
        if (_usdxToken == address(0)) revert InvalidAddress();
        if (_travelToken == address(0)) revert InvalidAddress();
        if (_feeRecipient == address(0)) revert InvalidAddress();
        if (_feePercentage > MAX_FEE_PERCENTAGE) revert InvalidFeePercentage();

        usdxToken = IERC20(_usdxToken);
        travelToken = IERC20(_travelToken);
        feeRecipient = _feeRecipient;
        feePercentage = _feePercentage;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
    }

    /// @notice Actualiza la configuración de comisiones
    /// @param _feeRecipient Nueva wallet para recibir comisiones
    /// @param _feePercentage Nuevo porcentaje de comisión en basis points
    function setFeeConfig(
        address _feeRecipient,
        uint256 _feePercentage
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_feeRecipient == address(0)) revert InvalidAddress();
        if (_feePercentage > MAX_FEE_PERCENTAGE) revert InvalidFeePercentage();

        feeRecipient = _feeRecipient;
        feePercentage = _feePercentage;

        emit FeeConfigUpdated(_feeRecipient, _feePercentage);
    }

    /// @notice Registra un nuevo vendedor en el sistema
    /// @param sellerId ID único del vendedor en la base de datos
    /// @param wallet Dirección de la wallet que recibirá los pagos
    function registerSeller(
        string calldata sellerId,
        address wallet
    ) external onlyRole(MANAGER_ROLE) {
        if (bytes(sellerId).length == 0) revert InvalidSellerId();
        if (wallet == address(0)) revert InvalidAddress();
        if (sellers[sellerId].wallet != address(0)) revert SellerAlreadyRegistered();

        sellers[sellerId] = Seller({wallet: wallet, active: true});

        emit SellerRegistered(sellerId, wallet);
    }

    /// @notice Actualiza la información de un vendedor
    /// @param sellerId ID del vendedor
    /// @param newWallet Nueva dirección de wallet
    /// @param active Estado activo/inactivo del vendedor
    function updateSeller(
        string calldata sellerId,
        address newWallet,
        bool active
    ) external onlyRole(MANAGER_ROLE) {
        Seller storage seller = sellers[sellerId];
        if (seller.wallet == address(0)) revert SellerNotFound();
        if (newWallet == address(0)) revert InvalidAddress();

        seller.wallet = newWallet;
        seller.active = active;

        emit SellerUpdated(sellerId, newWallet, active);
    }

    /// @notice Compra un producto usando USDX y quemando TravelTokens
    /// @param productId ID del producto en la base de datos
    /// @param sellerId ID del vendedor
    /// @param usdxAmount Precio total del producto en USDX (con decimales incluidos)
    /// @param tokensRequired Cantidad de TravelTokens a quemar como descuento/promoción
    /// @dev El comprador debe aprobar tanto USDX como TravelToken antes de llamar esta función
    /// @dev La comisión se deduce del usdxAmount y el resto va al vendedor
    /// @dev Sigue el patrón Checks-Effects-Interactions para máxima seguridad y eficiencia
    function purchaseProduct(
        string calldata productId,
        string calldata sellerId,
        uint256 usdxAmount,
        uint256 tokensRequired
    ) external nonReentrant {
        // ============ CHECKS: Todas las validaciones primero ============

        // Validaciones básicas
        if (bytes(productId).length == 0) revert InvalidProductId();
        if (usdxAmount == 0) revert InvalidAmount();

        // Validar vendedor
        Seller memory seller = sellers[sellerId];
        if (seller.wallet == address(0)) revert SellerNotFound();
        if (!seller.active) revert SellerInactive();

        address buyer = msg.sender;

        // Verificar USDX: balances y allowances
        if (usdxToken.balanceOf(buyer) < usdxAmount) revert InsufficientUSDXBalance();
        if (usdxToken.allowance(buyer, address(this)) < usdxAmount) {
            revert InsufficientUSDXAllowance();
        }

        // Verificar TravelToken: balances y allowances (antes de cualquier transferencia)
        if (tokensRequired > 0) {
            if (travelToken.balanceOf(buyer) < tokensRequired) {
                revert InsufficientTravelTokens();
            }
            if (travelToken.allowance(buyer, address(this)) < tokensRequired) {
                revert InsufficientTravelTokenAllowance();
            }
        }

        // ============ EFFECTS: Calcular valores ============

        uint256 feeAmount = (usdxAmount * feePercentage) / 10000;
        uint256 sellerAmount = usdxAmount - feeAmount;

        // ============ INTERACTIONS: Transferencias externas ============

        // Transferir USDX: comisión al protocolo
        if (feeAmount > 0) {
            if (!usdxToken.transferFrom(buyer, feeRecipient, feeAmount)) {
                revert TransferFailed();
            }
        }

        // Transferir USDX: pago al vendedor
        if (!usdxToken.transferFrom(buyer, seller.wallet, sellerAmount)) {
            revert TransferFailed();
        }

        // Quemar TravelTokens
        if (tokensRequired > 0) {
            if (!travelToken.transferFrom(buyer, address(0xdead), tokensRequired)) {
                revert TransferFailed();
            }
        }

        // Emitir evento con todos los datos para indexación
        emit ProductPurchased(
            buyer,
            sellerId,
            productId,
            usdxAmount,
            sellerAmount,
            feeAmount,
            tokensRequired,
            block.timestamp
        );
    }

    /// @notice Obtiene información de un vendedor
    /// @param sellerId ID del vendedor
    /// @return Información completa del vendedor
    function getSeller(string calldata sellerId)
        external
        view
        returns (Seller memory)
    {
        return sellers[sellerId];
    }

    /// @notice Verifica si un vendedor está registrado y activo
    /// @param sellerId ID del vendedor
    /// @return active true si el vendedor está activo
    function isSellerActive(string calldata sellerId)
        external
        view
        returns (bool active)
    {
        return sellers[sellerId].active;
    }

    /// @notice Calcula cuánto recibirá el vendedor después de la comisión
    /// @param amount Monto total de la compra
    /// @return feeAmount Monto de la comisión
    /// @return sellerAmount Monto que recibirá el vendedor
    function calculateFee(uint256 amount)
        external
        view
        returns (uint256 feeAmount, uint256 sellerAmount)
    {
        feeAmount = (amount * feePercentage) / 10000;
        sellerAmount = amount - feeAmount;
    }
}
