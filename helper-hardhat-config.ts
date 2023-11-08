import { networkConfigInfo } from './global'

export const networkConfig: networkConfigInfo = {
    hardhat: {
        blockConfirmations: 5,
    },
    sepolia: {
        blockConfirmations: 5,
    },
}

export const devChains = ['hardhat', 'localhost']
