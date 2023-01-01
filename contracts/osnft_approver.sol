// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./osnft_approver_base.sol";
import "./interfaces/osnft_approver.sol";

contract OSNFTApprover is
    Initializable,
    OwnableUpgradeable,
    OSNFTApproverBase,
    IOSNFTApprover
{
    function initialize() external initializer {
        __Ownable_init();
        __OSNFTApproverInitialize__();
    }

    function approveProject(ProjectApproveRequest calldata data) external {
        require(isApprover(_msgSender()), "Only approvers allowed");

        _projectsApproved[data.tokenId] = ProjectApprovedInfo({
            mintTo: data.mintTo,
            worth: worthOfProject(data.starCount, data.forkCount)
        });
        emit ProjectApproved(data.tokenId, data.mintTo);
    }

    function getApprovedProject(
        bytes32 tokenId
    ) external view override returns (ProjectApprovedInfo memory) {
        return _projectsApproved[tokenId];
    }

    function isApprover(address account) public view returns (bool) {
        return _approvers[account];
    }

    function addApprover(address account) external override onlyOwner {
        _approvers[account] = true;
        emit ApproverAdded(account);
    }

    function removeApprover(address account) external override onlyOwner {
        delete _approvers[account];
        emit ApproverRemoved(account);
    }

    function worthOfProject(
        uint256 starCount,
        uint256 forkCount
    ) public view returns (uint256) {
        uint256 value = (_worthConstant * starCount * 4) +
            (_worthConstant * forkCount * 2);
        // worth can not be more than one token
        return value > _oneToken ? _oneToken : value;
    }
}
