// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title PlaceNFT
/// @notice Representa lugares turísticos como NFTs únicos otorgados a visitantes al hacer check-in.
contract PlaceNFT is ERC721URIStorage, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private _tokenIdCounter;

    struct Place {
        string placeId; // Identificador único, ej: "machupicchu-peru"
        string name; // Nombre del sitio
        string metadataURI; // IPFS o URL con datos del lugar
        bool active;
    }

    mapping(string => Place) public places;

    event PlaceRegistered(string placeId, string name, string metadataURI);
    event PlaceNFTMinted(address indexed to, string placeId, uint256 tokenId);

    error PlaceInactiveOrNotRegistered();
    error PlaceAlreadyRegistered();

    constructor() ERC721("TuristNFT", "TURINFT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Override supportsInterface to resolve inheritance conflict
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /// @notice Registrar un nuevo lugar turístico
    function registerPlace(
        string memory placeId,
        string memory name,
        string memory metadataURI
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (places[placeId].active) revert PlaceAlreadyRegistered();
        places[placeId] = Place(placeId, name, metadataURI, true);
        emit PlaceRegistered(placeId, name, metadataURI);
    }

    /// @notice Emitir un NFT representando la visita a un lugar
    function mintPlaceNFT(
        address to,
        string memory placeId
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        Place memory place = places[placeId];
        if (!place.active) revert PlaceInactiveOrNotRegistered();

        uint256 newId = ++_tokenIdCounter;

        _safeMint(to, newId);
        _setTokenURI(newId, place.metadataURI);

        emit PlaceNFTMinted(to, placeId, newId);
        return newId;
    }
}
