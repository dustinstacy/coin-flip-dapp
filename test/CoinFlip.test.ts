import { Address } from 'hardhat-deploy/dist/types'
import { CoinFlip } from '../typechain-types'
import { Signer } from 'ethers'
import { deployments, ethers } from 'hardhat'

describe('Coin Flip Dapp', () => {
    let coinFlipContract: CoinFlip
    let coinFlipAddress: Address
    let deployer: Signer
    let entrant: Signer

    const HEADS = 0
    const TAILS = 1
    const WAGERAMOUNT = ethers.parseEther('0.1')

    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        entrant = accounts[1]

        await deployments.fixture('all')
        coinFlipAddress = (await deployments.get('CoinFlip')).address
        coinFlipContract = await ethers.getContractAt('CoinFlip', coinFlipAddress)
        coinFlipContract.connect(deployer)
    })

    describe('contstructor', () => {
        it('should properly set the minimum wager amount', async () => {})
        it('should properly set the contract owner', async () => {})
    })
    describe('addFunds', async () => {
        it('should revert if sender is not owner', async () => {})
        it('should increase the contract balance by sent amount', async () => {})
    })
    describe('enterWager', () => {
        it('should revert if minimum wager amount is not met', async () => {})
        it('should set the last time stamp variable to the current timestamp', async () => {})
        it('should properly set the coin flip result value to 0 or 1', async () => {})
        it('should emit a Wager Entered event', async () => {})
    })
    describe('fulfillRandomCoinFlipResult', () => {
        it('should only return double the entrants wager if they guess correctly', async () => {})
        it('should emit a Coin Flip Result event', async () => {})
    })
})
