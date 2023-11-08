import { DeployFunction } from 'hardhat-deploy/dist/types'
import { DeployInterface } from '../global'

const deployCoinFlip: DeployFunction = async ({
    getNamedAccounts,
    deployments,
    network,
}: DeployInterface) => {}

export default deployCoinFlip
deployCoinFlip.tags = ['all', 'coinFlip']
