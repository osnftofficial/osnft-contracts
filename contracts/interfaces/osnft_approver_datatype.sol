// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.8.0-rc.1) (token/ERC721/IERC721.sol)

pragma solidity ^0.8.17;

/**
 * @dev Required interface of an approver contract
 */
interface IOSNFTApproverDataType {
    struct ProjectApprovedInfo {
        address mintTo;
        uint256 worth;
    }

    struct ProjectApproveRequest {
        bytes32 tokenId;
        address mintTo;
        uint256 starCount;
        uint256 forkCount;
    }

    event ProjectApproved(bytes32 indexed tokenId, address indexed account);

    event ApproverAdded(address account);

    event ApproverRemoved(address account);
}