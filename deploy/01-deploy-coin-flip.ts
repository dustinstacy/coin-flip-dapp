import { DeployFunction } from 'hardhat-deploy/dist/types'
import { DeployInterface } from '../global'
import { ethers } from 'ethers'
import { devChains, networkConfig } from '../helper-hardhat-config'
import verify from '../utils/verify'

const MINIMUM_WAGER = ethers.parseEther('0.1')

const deployCoinFlip: DeployFunction = async ({
    getNamedAccounts,
    deployments,
    network,
}: DeployInterface) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()

    log('----------------------')
    log('Deploying Coin Flip Dapp.......')

    const args: any[] = [MINIMUM_WAGER]
    const coinFlip = await deploy('CoinFlip', {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: 1,
    })

    if (!devChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(coinFlip.address, args)
    }

    log('----------------------')
}

export default deployCoinFlip
deployCoinFlip.tags = ['all', 'coinFlip']
