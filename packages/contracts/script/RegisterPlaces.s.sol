// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {PlaceNFT} from "../src/PlaceNFT.sol";

contract RegisterPlaces is Script {
    function run() external {
        // TODO: Reemplazar con la dirección del contrato PlaceNFT desplegado
        address placeNFTAddress = 0xAC92D1dE90A040fB2df7d10A6fFF4d8B98e9cBc0; // <<<< COMPLETAR ADDRESS AQUÍ

        require(placeNFTAddress != address(0), "PlaceNFT address not set");

        PlaceNFT placeNFT = PlaceNFT(placeNFTAddress);

        vm.startBroadcast();

        // Place 1
        placeNFT.registerPlace(
            "belmond-hotel-monasterio", // <<<< placeId (ej: "machupicchu-peru")
            "belmond-hotel-monasterio", // <<<< name (ej: "Machu Picchu")
            "https://scarlet-active-lynx-845.mypinata.cloud/ipfs/bafybeihov3e6z5sz4h35rtbreyxb7xyxcqtiklfqolx7r4d7wp4ybziqc4/belmond-hotel-monasterio.json" // <<<< metadataURI (ej: "ipfs://...")
        );

        // Place 2
        placeNFT.registerPlace(
            "centro-artesanal-cusco", // <<<< placeId
            "Centro Artesanal Cusco", // <<<< name
            "https://scarlet-active-lynx-845.mypinata.cloud/ipfs/bafybeihov3e6z5sz4h35rtbreyxb7xyxcqtiklfqolx7r4d7wp4ybziqc4/centro-artesanal-cusco.json" // <<<< metadataURI
        );

        // Place 3
        placeNFT.registerPlace(
            "chicha-por-gaston-acurio", // <<<< placeId
            "Chicha por Gaston Acurio", // <<<< name
            "https://scarlet-active-lynx-845.mypinata.cloud/ipfs/bafybeihov3e6z5sz4h35rtbreyxb7xyxcqtiklfqolx7r4d7wp4ybziqc4/chicha-por-gastn-acurio.json" // <<<< metadataURI
        );

        // Place 4
        placeNFT.registerPlace(
            "limo-cocina-peruana", // <<<< placeId
            "Limo Cocina Peruana", // <<<< name
            "https://scarlet-active-lynx-845.mypinata.cloud/ipfs/bafybeihov3e6z5sz4h35rtbreyxb7xyxcqtiklfqolx7r4d7wp4ybziqc4/limo-cocina-peruana.json" // <<<< metadataURI
        );

        // Place 5
        placeNFT.registerPlace(
            "museo-inka", // <<<< placeId
            "Museo Inka", // <<<< name
            "https://scarlet-active-lynx-845.mypinata.cloud/ipfs/bafybeihov3e6z5sz4h35rtbreyxb7xyxcqtiklfqolx7r4d7wp4ybziqc4/museo-inka.json" // <<<< metadataURI
        );

        // Place 6
        placeNFT.registerPlace(
            "plaza-de-armas", // <<<< placeId
            "Plaza de Armas", // <<<< name
            "https://scarlet-active-lynx-845.mypinata.cloud/ipfs/bafybeihov3e6z5sz4h35rtbreyxb7xyxcqtiklfqolx7r4d7wp4ybziqc4/plaza-de-armas.json" // <<<< metadataURI
        );

        // Place 7
        placeNFT.registerPlace(
            "qorikancha-temple", // <<<< placeId
            "Qorikancha Temple", // <<<< name
            "https://scarlet-active-lynx-845.mypinata.cloud/ipfs/bafybeihov3e6z5sz4h35rtbreyxb7xyxcqtiklfqolx7r4d7wp4ybziqc4/qorikancha-temple.json" // <<<< metadataURI
        );

        // Place 8
        placeNFT.registerPlace(
            "sacsayhuaman", // <<<< placeId
            "Sacsayhuaman", // <<<< name
            "https://scarlet-active-lynx-845.mypinata.cloud/ipfs/bafybeihov3e6z5sz4h35rtbreyxb7xyxcqtiklfqolx7r4d7wp4ybziqc4/sacsayhuamn.json" // <<<< metadataURI
        );

        // Place 9
        placeNFT.registerPlace(
            "san-pedro-market", // <<<< placeId
            "San Pedro Market", // <<<< name
            "https://scarlet-active-lynx-845.mypinata.cloud/ipfs/bafybeihov3e6z5sz4h35rtbreyxb7xyxcqtiklfqolx7r4d7wp4ybziqc4/san-pedro-market.json" // <<<< metadataURI
        );

        // Place 10
        placeNFT.registerPlace(
            "twelve-angled-stone", // <<<< placeId
            "Twelve-Angled Stone", // <<<< name
            "https://scarlet-active-lynx-845.mypinata.cloud/ipfs/bafybeihov3e6z5sz4h35rtbreyxb7xyxcqtiklfqolx7r4d7wp4ybziqc4/twelve-angled-stone.json" // <<<< metadataURI
        );

        vm.stopBroadcast();

        console.log("\n=== All 10 Places Registered Successfully ===");
    }
}
