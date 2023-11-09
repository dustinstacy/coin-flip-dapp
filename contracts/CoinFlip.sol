// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/////////////////////
/// Custom Errors ///
/////////////////////

error CoinFlip__NotEnoughWagered(uint256 minimum, uint256 sent);
error CoinFlip__TransferFailed();

contract CoinFlip {
    address private immutable i_owner;
    uint256 private immutable i_minimumWager;
    uint256 private lastTimeStamp;
    uint256 private coinFlipResult;

    event WagerEntered(
        address indexed entrant,
        uint256 entrantsWager,
        uint256 entrantsGuess
    );

    event CoinFlipResult(uint256 entrantsGuess, uint256 result);

    constructor(uint256 minimumWager) {
        i_minimumWager = minimumWager;
        i_owner = msg.sender;
    }

    //////////////////////
    /// Main Functions ///
    //////////////////////

    function fundContract() public payable {}

    function enterWager(uint256 entrantsGuess) public payable {
        if (msg.value < i_minimumWager) {
            revert CoinFlip__NotEnoughWagered(i_minimumWager, msg.value);
        }
        emit WagerEntered(msg.sender, msg.value, entrantsGuess);
        fulfillRandomCoinFlipResult(msg.sender, msg.value, entrantsGuess);
    }

    function fulfillRandomCoinFlipResult(
        address entrant,
        uint256 entrantsWager,
        uint256 entrantsGuess
    ) private {
        lastTimeStamp = block.timestamp;
        coinFlipResult = lastTimeStamp % 2;
        if (entrantsGuess == coinFlipResult) {
            (bool success, ) = entrant.call{value: entrantsWager * 2}("");
            if (!success) {
                revert CoinFlip__TransferFailed();
            }
        }
        emit CoinFlipResult(entrantsGuess, coinFlipResult);
    }
}
