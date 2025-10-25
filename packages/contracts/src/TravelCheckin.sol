// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { TravelToken } from "./TravelToken.sol";
import { PlaceNFT } from "./PlaceNFT.sol";

/// @title TravelCheckin
/// @notice Sistema de check-in turístico con entrega de tokens y NFTs del lugar.
contract TravelCheckin is AccessControl {
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");

    TravelToken public tokenContract;
    PlaceNFT public placeNFT;

    mapping(address => mapping(bytes32 => bool)) public hasCheckedIn;

    enum SkipReason {
        InvalidAddress,
        AlreadyCheckedIn
    }

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
        SkipReason reason
    );

    error CheckinAlreadyRegistered();
    error hasToBeMoreThanZero();
    error hasToBeLessThanMaxUsers();
    error InvalidAddress();

    constructor(address tokenAddress, address nftAddress) {
        tokenContract = TravelToken(tokenAddress);
        placeNFT = PlaceNFT(nftAddress);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Agregar validadores (operadores turísticos, municipios, etc.)
    function addValidator(address validator) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VALIDATOR_ROLE, validator);
    }

    /// @notice Verificar si un usuario ya hizo check-in en un lugar específico
    function hasVisited(address user, string memory placeId)
        external
        view
        returns (bool)
    {
        bytes32 placeHash = keccak256(abi.encodePacked(placeId));
        return hasCheckedIn[user][placeHash];
    }

    /// @notice Ejecutar el check-in turístico: otorga tokens + NFT del sitio
    function validateCheckin(
        address user,
        string memory placeId,
        uint256 reward
    ) external onlyRole(VALIDATOR_ROLE) {
        bytes32 placeHash = keccak256(abi.encodePacked(placeId));
        if (hasCheckedIn[user][placeHash]) revert CheckinAlreadyRegistered();

        hasCheckedIn[user][placeHash] = true;

        // Recompensa en tokens
        tokenContract.mint(user, reward);

        // NFT representando el lugar visitado
        uint256 nftId = placeNFT.mintPlaceNFT(user, placeId);

        emit CheckinCompleted(user, placeHash, placeId, reward, nftId, block.timestamp);
    }

    /// @notice Ejecutar check-in grupal: múltiples usuarios en un mismo lugar
    /// @dev Caso de uso: guía turístico registra a todo su grupo en Machu Picchu
    function validateGroupCheckin(
        address[] memory users,
        string memory placeId,
        uint256 reward 
    ) external onlyRole(VALIDATOR_ROLE) {
        if (users.length == 0) revert hasToBeMoreThanZero();
        if (users.length > 10) revert hasToBeLessThanMaxUsers();

        bytes32 placeHash = keccak256(abi.encodePacked(placeId));

        for (uint256 i = 0; i < users.length; i++) {
            address user = users[i];

            // Saltar direcciones inválidas sin revertir toda la transacción
            if (user == address(0)) {
                emit CheckinSkipped(user, placeHash, SkipReason.InvalidAddress);
                continue;
            }

            // Saltar usuarios que ya hicieron check-in
            if (hasCheckedIn[user][placeHash]) {
                emit CheckinSkipped(user, placeHash, SkipReason.AlreadyCheckedIn);
                continue;
            }

            hasCheckedIn[user][placeHash] = true;

            // Recompensa en tokens
            tokenContract.mint(user, reward);

            // NFT representando el lugar visitado
            uint256 nftId = placeNFT.mintPlaceNFT(user, placeId);

            emit CheckinCompleted(user, placeHash, placeId, reward, nftId, block.timestamp);
        }
    }
}
