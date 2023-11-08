// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/////////////////////
/// Custom Errors ///
/////////////////////

contract CoinFlip {
    uint256 private _minimumWager;

    mapping(address => uint256) private _balances;

    //////////////
    /// Events ///
    //////////////

    constructor(uint256 minimumWager_) {
        _minimumWager = minimumWager_;
    }
}
