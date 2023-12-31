import { DeploymentsExtension } from 'hardhat-deploy/dist/types'
import { Network } from 'hardhat/types'

export interface DeployInterface {
    getNamedAccounts: () => Promise<{
        [name: string]: string
    }>
    deployments: DeploymentsExtension
    network: Network
}

interface networkConfigItem {
    vrfCoordinatorV2?: string
    gasLane?: string
    subscriptionId?: string
    callbackGasLimit?: string
    interval?: number
    blockConfirmations?: number
    minimumWager?: bigInt
}

export interface networkConfigInfo {
    [key: string]: networkConfigItem
}
