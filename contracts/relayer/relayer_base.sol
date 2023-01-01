// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "../interfaces/relayer.sol";
import "../interfaces/marketplace.sol";
import "../interfaces/osnft.sol";

contract OSDRelayerBase is EIP712, IOsNFTRelayer {
    using ECDSA for bytes32;

    IOSNFTMarketPlaceUpgradeable internal _marketplace;
    IOSNFT internal _nft;
    bytes32 internal immutable _TYPE_HASH_NFTListOnSaleData;
    bytes32 internal immutable _TYPE_HASH_NFTAuctionData;

    constructor(
        address marketplace_,
        address nft_
    ) EIP712("OSNFT_RELAYER", "1") {
        _marketplace = IOSNFTMarketPlaceUpgradeable(marketplace_);
        _nft = IOSNFT(nft_);
        _TYPE_HASH_NFTListOnSaleData = keccak256(
            "NFTListOnSaleData(bytes32 tokenId,uint32 share,uint256 price,address erc20token,uint32 sellPriority,uint256 deadline)"
        );
        _TYPE_HASH_NFTAuctionData = keccak256(
            "NFTAuctionData(bytes32 tokenId,uint32 share,uint256 initialBid,uint256 endAuction,address paymentToken,uint32 sellPriority,uint256 deadline)"
        );
    }

    function _requireDeadlineNotExpired(
        SignatureMeta calldata signatureData
    ) internal view {
        require(block.timestamp < signatureData.deadline, "Signature expired");
    }
}