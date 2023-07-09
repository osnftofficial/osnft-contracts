// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

interface IOSNFT {
    // structs
    struct ProjectInfo {
        uint256 basePrice;
        address creator;
        uint16 minCreatorRoyalty;
        address paymentToken;
        // price of one popularity factor
        uint256 popularityFactorPrice;
        // last mint price
        uint256 lastMintPrice;
        uint256 contributors;
        uint256 treasuryAmount;
    }

    struct SignatureMeta {
        bytes signature;
        uint256 validUntil;
        address by;
    }

    struct ProjectTokenizeInput {
        string projectUrl;
        uint256 basePrice;
        uint256 popularityFactorPrice;
        address paymentToken;
        uint8 minCreatorRoyalty;
    }

    // errors
    error AlreadyMinted();
    error PaymentFailed();
    error RoyaltyLimitExceeded();
    error InadequateRoyalty();
    error RequireTokenOwner();
    error RequireVerifier();
    error RequireRelayer();
    error ProjectExist();
    error SignatureExpired();
    error InvalidSignature();
    error PaymentTokenNotAllowed();
    error InvalidToken(uint256 tokenId);
    error InvalidPercentage();

    // events
    event ProjectTokenized(
        uint256 indexed tokenId,
        address creator,
        uint256 basePrice,
        uint256 popularityFactorPrice,
        address paymentToken,
        uint8 minCreatorRoyalty,
        string projectUrl
    );
    event TokenMinted(
        uint256 tokenId,
        address to,
        uint256 star,
        uint256 fork,
        uint256 mintPrice,
        uint16 royaltyOpted
    );
    event MintRoyaltyUpdated(uint16 newMintRoyalty);
    event BurnRoyaltyUpdated(uint16 newBurnRoyalty);

    function tokenizeProject(
        ProjectTokenizeInput calldata input,
        SignatureMeta calldata verifierSignatureData
    ) external;
}
