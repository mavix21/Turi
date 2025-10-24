// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./TravelToken.sol";
import "./PlaceNFT.sol";

/// @title TravelCheckin
/// @notice Sistema de check-in turístico con entrega de tokens y NFTs del lugar.
contract TravelCheckin is AccessControl {
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");

    TravelToken public tokenContract;
    PlaceNFT public placeNFT;

    mapping(address => mapping(bytes32 => bool)) public hasCheckedIn;

    event CheckinCompleted(
        address indexed user,
        string placeId,
        uint256 reward,
        uint256 nftId,
        uint256 timestamp
    );

    constructor(address tokenAddress, address nftAddress) {
        tokenContract = TravelToken(tokenAddress);
        placeNFT = PlaceNFT(nftAddress);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Agregar validadores (operadores turísticos, municipios, etc.)
    function addValidator(address validator) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VALIDATOR_ROLE, validator);
    }

    /// @notice Ejecutar el check-in turístico: otorga tokens + NFT del sitio
    function validateCheckin(
        address user,
        string memory placeId,
        uint256 reward
    ) external onlyRole(VALIDATOR_ROLE) {
        bytes32 placeHash = keccak256(abi.encodePacked(placeId));
        require(!hasCheckedIn[user][placeHash], "Check-in ya registrado");

        hasCheckedIn[user][placeHash] = true;

        // 1️⃣ Recompensa en tokens
        tokenContract.mint(user, reward);

        // 2️⃣ NFT representando el lugar visitado
        uint256 nftId = placeNFT.mintPlaceNFT(user, placeId);

        emit CheckinCompleted(user, placeId, reward, nftId, block.timestamp);
    }
}
