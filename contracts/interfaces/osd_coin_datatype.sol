// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./osd_coin_datatype.sol";

interface IOSDCoinDataTye {
    event DefaultOperatorAdded(address indexed operator);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    event DefaultOperatorRemoved(address indexed operator);
}
