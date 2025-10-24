// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title PlaceNFT
/// @notice Representa lugares turísticos como NFTs únicos otorgados a visitantes al hacer check-in.
contract PlaceNFT is ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;

    struct Place {
        string placeId;        // Identificador único, ej: "machupicchu-peru"
        string name;           // Nombre del sitio
        string metadataURI;    // IPFS o URL con datos del lugar
        bool active;
    }

    mapping(string => Place) public places;

    event PlaceRegistered(string placeId, string name, string metadataURI);
    event PlaceNFTMinted(address indexed to, string placeId, uint256 tokenId);

    constructor() ERC721("PlaceNFT", "PLCNFT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Registrar un nuevo lugar turístico
    function registerPlace(
        string memory placeId,
        string memory name,
        string memory metadataURI
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(!places[placeId].active, "Lugar ya registrado");
        places[placeId] = Place(placeId, name, metadataURI, true);
        emit PlaceRegistered(placeId, name, metadataURI);
    }

    /// @notice Emitir un NFT representando la visita a un lugar
    function mintPlaceNFT(address to, string memory placeId)
        external
        onlyRole(MINTER_ROLE)
        returns (uint256)
    {
        Place memory place = places[placeId];
        require(place.active, "Lugar no registrado o inactivo");

        _tokenIdCounter.increment();
        uint256 newId = _tokenIdCounter.current();

        _safeMint(to, newId);
        _setTokenURI(newId, place.metadataURI);

        emit PlaceNFTMinted(to, placeId, newId);
        return newId;
    }
}
