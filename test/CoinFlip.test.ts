import { Address } from 'hardhat-deploy/dist/types'
import { CoinFlip } from '../typechain-types'
import { ContractTransactionReceipt, Signer } from 'ethers'
import { deployments, ethers, network } from 'hardhat'
import { expect } from 'chai'
import { networkConfig } from '../helper-hardhat-config'
import { TypedContractEvent } from '../typechain-types/common'

describe('Coin Flip Dapp', () => {
    let coinFlipContract: CoinFlip
    let coinFlipAddress: Address
    let coinFlip: CoinFlip
    let deployer: Signer
    let entrant: Signer
    let minimumWager: bigint
    let gasCost: bigint

    const HEADS = 0
    const TAILS = 1

    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        entrant = accounts[1]
        minimumWager = networkConfig[network.name].minimumWager!

        await deployments.fixture('all')
        coinFlipAddress = (await deployments.get('CoinFlip')).address
        coinFlipContract = await ethers.getContractAt('CoinFlip', coinFlipAddress)
        coinFlipContract.connect(deployer)
        coinFlip = coinFlipContract.connect(entrant)
    })

    describe('contstructor', () => {
        it('should properly set the minimum wager amount', async () => {
            const minimumWager = await coinFlipContract.getMinimumWager()
            expect(minimumWager).to.equal(networkConfig[network.name].minimumWager)
        })
        it('should properly set the contract owner', async () => {
            const owner = await coinFlipContract.getOwner()
            expect(owner).to.equal(await deployer.getAddress())
        })
    })

    describe('addFunds', async () => {
        it('should increase the contract balance by sent amount', async () => {
            const amountSent = ethers.parseEther('10')
            const tx = await coinFlipContract.fundContract({ value: amountSent })
            await tx.wait(1)
            const contractBalance = await ethers.provider.getBalance(coinFlipAddress)
            expect(contractBalance).to.equal(amountSent)
        })
    })

    describe('enterWager', () => {
        beforeEach(async () => {
            await coinFlipContract.fundContract({
                value: ethers.parseEther('10'),
            })
        })
        it('should revert if minimum wager amount is not met', async () => {
            await expect(
                coinFlipContract.enterWager(HEADS, minimumWager, entrant)
            ).to.be.revertedWithCustomError(coinFlipContract, 'CoinFlip__NotEnoughWagered')
        })

        it('should emit a Wager Entered event', async () => {
            await expect(
                coinFlip.enterWager(TAILS, minimumWager, entrant, {
                    value: minimumWager.toString(),
                })
            ).to.emit(coinFlipContract, 'WagerEntered')
        })

        it('sets the timestamp, the coin flip result, sends ETH on correct guess, and emits event', async () => {
            const entrantsGuess = HEADS
            const startingBalance = await ethers.provider.getBalance(entrant)
            const tx = await coinFlip.enterWager(entrantsGuess, minimumWager, entrant, {
                value: minimumWager,
            })
            const txReceipt = await tx.wait(1)
            let { gasUsed, gasPrice } = txReceipt as ContractTransactionReceipt
            gasCost = gasUsed * gasPrice
            const coinFlipResult = await coinFlipContract.getCoinFlipResult()
            const endingBalance = await ethers.provider.getBalance(entrant)
            if (BigInt(entrantsGuess) == coinFlipResult) {
                console.log('won')
                expect(endingBalance).to.equal(startingBalance + minimumWager - gasCost)
            } else {
                console.log('lost')
                expect(endingBalance).to.equal(startingBalance - minimumWager - gasCost)
            }
        })
    })
})
