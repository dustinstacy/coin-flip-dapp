import { ethers } from 'hardhat'
import { networkConfigInfo } from './global'

export const networkConfig: networkConfigInfo = {
    hardhat: {
        blockConfirmations: 1,
        minimumWager: ethers.parseEther('0.1'),
    },
    sepolia: {
        blockConfirmations: 1,
        minimumWager: ethers.parseEther('0.1'),
    },
}

export const devChains = ['hardhat', 'localhost']
