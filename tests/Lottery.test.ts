import { describe, it, expect } from 'vitest';
import { ethers } from 'hardhat';
import { Lottery } from '../src/contracts/Lottery.sol';

describe('Lottery Contract', () => {
    let lottery: Lottery;
    let owner: any;
    let participant1: any;
    let participant2: any;

    beforeEach(async () => {
        const [ownerSigner, participant1Signer, participant2Signer] = await ethers.getSigners();
        owner = ownerSigner;
        participant1 = participant1Signer;
        participant2 = participant2Signer;

        const LotteryFactory = await ethers.getContractFactory('Lottery');
        lottery = await LotteryFactory.deploy();
        await lottery.deployed();
    });

    it('should start a new lottery round', async () => {
        await lottery.startNewRound();
        const currentRoundId = await lottery.currentRoundId();
        expect(currentRoundId).toBe(1);
    });

    it('should add participants to the current round', async () => {
        await lottery.startNewRound();
        
        await lottery.connect(participant1).addParticipant(participant1.address, { value: ethers.utils.parseEther('1') });
        await lottery.connect(participant2).addParticipant(participant2.address, { value: ethers.utils.parseEther('1') });

        const participants = await lottery.getRoundParticipants(1);
        expect(participants).toContain(participant1.address);
        expect(participants).toContain(participant2.address);
    });

    it('should complete a lottery round', async () => {
        await lottery.startNewRound();
        await lottery.connect(participant1).addParticipant(participant1.address, { value: ethers.utils.parseEther('1') });
        
        await lottery.completeLotteryRound(participant1.address);

        const roundDetails = await lottery.getLotteryRoundDetails(1);
        expect(roundDetails.isComplete).toBe(true);
        expect(roundDetails.winner).toBe(participant1.address);
    });

    it('should retrieve total rounds', async () => {
        await lottery.startNewRound();
        await lottery.startNewRound();

        const totalRounds = await lottery.getTotalRounds();
        expect(totalRounds).toBe(2);
    });
});