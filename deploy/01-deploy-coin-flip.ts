import { DeployFunction } from 'hardhat-deploy/dist/types'
import { DeployInterface } from '../global'
import { devChains, networkConfig } from '../helper-hardhat-config'
import verify from '../utils/verify'
import { network } from 'hardhat'

const deployCoinFlip: DeployFunction = async ({
    getNamedAccounts,
    deployments,
}: DeployInterface) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()

    log('----------------------')
    log('Deploying Coin Flip Dapp.......')

    const args: any[] = [networkConfig[network.name].minimumWager]
    const coinFlip = await deploy('CoinFlip', {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })

    if (!devChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(coinFlip.address, args)
    }

    log('----------------------')
}

export default deployCoinFlip
deployCoinFlip.tags = ['all', 'coinFlip']
