import { Address } from 'hardhat-deploy/dist/types'
import { CoinFlip } from '../typechain-types'
import { Signer } from 'ethers'
import { deployments, ethers, network } from 'hardhat'
import { expect } from 'chai'
import { networkConfig } from '../helper-hardhat-config'
import { TypedContractEvent } from '../typechain-types/common'

describe('Coin Flip Dapp', () => {
    let coinFlipContract: CoinFlip
    let coinFlipAddress: Address
    let deployer: Signer
    let entrant: Signer
    let minimumWager: bigint

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
        it('should revert if minimum wager amount is not met', async () => {
            await expect(coinFlipContract.enterWager(HEADS)).to.be.revertedWithCustomError(
                coinFlipContract,
                'CoinFlip__NotEnoughWagered'
            )
        })

        it('should emit a Wager Entered event', async () => {
            coinFlipContract.connect(entrant)
            await expect(
                coinFlipContract.enterWager(TAILS, {
                    value: minimumWager.toString(),
                })
            ).to.emit(coinFlipContract, 'WagerEntered')
        })
    })

    describe('fulfillRandomCoinFlipResult', () => {
        beforeEach(async () => {
            const fundingTx = await coinFlipContract.fundContract({
                value: ethers.parseEther('10'),
            })
        })

        it('sets the timestamp, the coin flip result, sends ETH on correct guess, and emits event', async () => {
            const coinFlipResultEvent: TypedContractEvent =
                coinFlipContract.filters['CoinFlipResult']
            const startingTimeStamp = await coinFlipContract.getLastTimeStamp()
            coinFlipContract.connect(entrant)
            const tx = await coinFlipContract.enterWager(HEADS, {
                value: minimumWager,
            })
            const txReceipt = await tx.wait(1)

            await new Promise(async (resolve, reject) => {
                coinFlipContract.once(coinFlipResultEvent, async (entrantsGuess, result) => {
                    try {
                        const endingTimeStamp = await coinFlipContract.getLastTimeStamp()
                        const coinFlipResult = await coinFlipContract.getCoinFlipResult()
                        const endingBalance = await ethers.provider.getBalance(entrant)
                        expect(endingTimeStamp).to.be.greaterThan(startingTimeStamp)
                        expect(coinFlipResult).to.equal(result)
                        console.log(`ending timestamp ${endingTimeStamp}`)
                        console.log(`result: ${result}`)
                        console.log(`entrants guess: ${entrantsGuess}`)
                        console.log(`starting balance: ${startingBalance}`)
                        console.log(`ending balance: ${endingBalance}`)
                        if (entrantsGuess == result) {
                            console.log('won')
                            expect(endingBalance).to.equal(startingBalance + minimumWager)
                        } else {
                            console.log('lost')
                            expect(endingBalance).to.equal(startingBalance - minimumWager)
                        }
                        resolve(null)
                    } catch (e) {
                        reject(e)
                    }
                })
                const startingBalance = await ethers.provider.getBalance(entrant)
                const resultTx = await coinFlipContract.fulfillRandomCoinFlipResult(
                    entrant,
                    minimumWager,
                    HEADS
                )
            })
        })
    })
})
