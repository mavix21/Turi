// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title USDX Mock Stablecoin
/// @notice Stablecoin de prueba para compras en el ecosistema de turismo
/// @dev Mock ERC20 con decimales configurables y función de mint pública para testing
contract USDX is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint8 private immutable _decimals;

    /// @notice Constructor del contrato USDX
    /// @param initialSupply Suministro inicial de tokens (con decimales incluidos)
    constructor(uint256 initialSupply) ERC20("USDX Stablecoin", "USDX") {
        _decimals = 6; // Similar a USDC/USDT
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        if (initialSupply > 0) {
            _mint(msg.sender, initialSupply);
        }
    }

    /// @notice Retorna el número de decimales del token
    /// @return Número de decimales (6 para simular USDC/USDT)
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /// @notice Mintea tokens a una dirección específica
    /// @param to Dirección que recibirá los tokens
    /// @param amount Cantidad de tokens a mintear
    /// @dev Solo accesible por cuentas con MINTER_ROLE
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    /// @notice Función de faucet para testing - permite a usuarios obtener USDX gratis
    /// @param amount Cantidad de USDX a solicitar (en unidades base, ej: 100 * 10^6 = 100 USDX)
    /// @dev En producción esta función debería ser removida o controlada
    function faucet(uint256 amount) external {
        require(
            amount <= 10000 * 10 ** _decimals,
            "USDX: Max 10,000 USDX per faucet"
        );
        _mint(msg.sender, amount);
    }
}
