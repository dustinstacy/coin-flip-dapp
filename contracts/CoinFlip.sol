// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/////////////////////
/// Custom Errors ///
/////////////////////

error CoinFlip__NotEnoughWagered(uint256 minimum, uint256 sent);

contract CoinFlip {
    uint256 private immutable _minimumWager;
    uint256 private coinFlipResult;
    uint256 private lastTimeStamp;

    event WagerEntered(
        address indexed entrant,
        uint256 entrantsWager,
        uint256 entrantsGuess
    );

    constructor(uint256 minimumWager_) {
        _minimumWager = minimumWager_;
    }

    //////////////////////
    /// Main Functions ///
    //////////////////////

    function enterWager(uint256 entrantsGuess) public payable {
        if (msg.value < _minimumWager) {
            revert CoinFlip__NotEnoughWagered(_minimumWager, msg.value);
        }
        lastTimeStamp = block.timestamp;
        coinFlipResult = lastTimeStamp % 2;
        emit WagerEntered(msg.sender, msg.value, entrantsGuess);
        fulfillRandomCoinFlipResult();
    }

    function fulfillRandomCoinFlipResult() private {}
}
