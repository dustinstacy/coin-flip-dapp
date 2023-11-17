// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/////////////////////
/// Custom Errors ///
/////////////////////

error CoinFlip__NotEnoughWagered(uint256 minimum, uint256 sent);
error CoinFlip__TransferFailed();
error CoinFlip__NotOwner();
error CoinFlip__NoBalance();

contract CoinFlip {
    address private immutable i_owner;
    uint256 private immutable i_minimumWager;
    uint256 private lastTimeStamp;
    uint256 private coinFlipResult;

    event WagerEntered(
        address indexed entrant,
        uint256 indexed entrantsWager,
        uint256 indexed entrantsGuess
    );

    event CoinFlipResult(uint256 entrantsGuess, uint256 result);

    mapping(address => uint256) private _balances;

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert CoinFlip__NotOwner();
        }
        _;
    }

    constructor(uint256 minimumWager) {
        i_minimumWager = minimumWager;
        i_owner = msg.sender;
        lastTimeStamp = block.timestamp;
    }

    //////////////////////
    /// Main Functions ///
    //////////////////////

    function fund() public payable {
        _balances[i_owner] = _balances[i_owner] + msg.value;
    }

    function enterWager(uint256 entrantsGuess) public payable {
        if (msg.value < i_minimumWager) {
            revert CoinFlip__NotEnoughWagered(i_minimumWager, msg.value);
        }
        emit WagerEntered(msg.sender, msg.value, entrantsGuess);
        lastTimeStamp = block.timestamp;
        coinFlipResult = lastTimeStamp % 2;
        if (entrantsGuess == coinFlipResult) {
            _balances[msg.sender] = _balances[msg.sender] + (msg.value * 2);
            _balances[i_owner] = _balances[i_owner] - (msg.value * 2);
        }
    }

    function withdrawProceeds() external {
        uint256 balance = _balances[msg.sender];
        if (balance <= 0) {
            revert CoinFlip__NoBalance();
        }
        _balances[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        if (!success) {
            revert CoinFlip__TransferFailed();
        }
    }

    ///////////////////////
    /// Getter Functions///
    ///////////////////////

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getMinimumWager() public view returns (uint256) {
        return i_minimumWager;
    }

    function getLastTimeStamp() public view returns (uint256) {
        return lastTimeStamp;
    }

    function getCoinFlipResult() public view returns (uint256) {
        return coinFlipResult;
    }

    function getBalance(address account) public view returns (uint256) {
        return _balances[account];
    }
}
