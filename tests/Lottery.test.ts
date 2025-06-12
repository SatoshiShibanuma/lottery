import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Lottery } from '../src/contracts/Lottery.sol';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('Lottery Contract', function () {
    let lottery: Lottery;
    let owner: SignerWithAddress;
    let participant1: SignerWithAddress;
    let participant2: SignerWithAddress;

    beforeEach(async function () {
        [owner, participant1, participant2] = await ethers.getSigners();
        const LotteryFactory = await ethers.getContractFactory('Lottery');
        lottery = await LotteryFactory.deploy() as Lottery;
        await lottery.deployed();
    });

    it('should start a new lottery round', async function () {
        await lottery.startNewRound();
        const currentRoundId = await lottery.currentRoundId();
        expect(currentRoundId).to.equal(1);
    });

    it('should add participants to the current round', async function () {
        await lottery.startNewRound();
        
        await lottery.connect(participant1).addParticipant(participant1.address, { value: ethers.utils.parseEther('1') });
        await lottery.connect(participant2).addParticipant(participant2.address, { value: ethers.utils.parseEther('1') });

        const participants = await lottery.getRoundParticipants(1);
        expect(participants).to.include(participant1.address);
        expect(participants).to.include(participant2.address);
    });

    it('should complete a lottery round', async function () {
        await lottery.startNewRound();
        await lottery.connect(participant1).addParticipant(participant1.address, { value: ethers.utils.parseEther('1') });
        
        await lottery.completeLotteryRound(participant1.address);

        const roundDetails = await lottery.getLotteryRoundDetails(1);
        expect(roundDetails.isComplete).to.be.true;
        expect(roundDetails.winner).to.equal(participant1.address);
    });

    it('should retrieve total rounds', async function () {
        await lottery.startNewRound();
        await lottery.startNewRound();

        const totalRounds = await lottery.getTotalRounds();
        expect(totalRounds).to.equal(2);
    });
});