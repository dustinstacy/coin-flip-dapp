describe('Coin Flip Dapp', () => {
    describe('contstructor', () => {
        it('should properly set the minimum wager amount', async () => {})
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
