import { describe, it, expect } from 'vitest';

// Define a simple mock for LotteryRound struct
interface LotteryRound {
    roundId: number;
    startTime: number;
    endTime: number;
    potSize: number;
    participants: string[];
    winner: string;
    isComplete: boolean;
}

class MockLottery {
    private rounds: LotteryRound[] = [];
    public currentRoundId = 0;

    startNewRound() {
        this.currentRoundId++;
        const newRound: LotteryRound = {
            roundId: this.currentRoundId,
            startTime: Date.now(),
            endTime: 0,
            potSize: 0,
            participants: [],
            winner: '',
            isComplete: false
        };
        this.rounds.push(newRound);
    }

    addParticipant(participant: string, amount: number) {
        const currentRound = this.rounds[this.currentRoundId - 1];
        currentRound.participants.push(participant);
        currentRound.potSize += amount;
    }

    completeLotteryRound(winner: string) {
        const currentRound = this.rounds[this.currentRoundId - 1];
        currentRound.winner = winner;
        currentRound.isComplete = true;
        currentRound.endTime = Date.now();
    }

    getLotteryRoundDetails(roundId: number): LotteryRound {
        return this.rounds[roundId - 1];
    }

    getTotalRounds(): number {
        return this.currentRoundId;
    }
}

describe('Lottery Tracking', () => {
    it('should start a new lottery round', () => {
        const lottery = new MockLottery();
        lottery.startNewRound();
        expect(lottery.currentRoundId).toBe(1);
    });

    it('should add participants to the current round', () => {
        const lottery = new MockLottery();
        lottery.startNewRound();
        lottery.addParticipant('participant1', 100);
        lottery.addParticipant('participant2', 200);

        const round = lottery.getLotteryRoundDetails(1);
        expect(round.participants).toContain('participant1');
        expect(round.participants).toContain('participant2');
        expect(round.potSize).toBe(300);
    });

    it('should complete a lottery round', () => {
        const lottery = new MockLottery();
        lottery.startNewRound();
        lottery.addParticipant('winner', 100);
        lottery.completeLotteryRound('winner');

        const round = lottery.getLotteryRoundDetails(1);
        expect(round.isComplete).toBe(true);
        expect(round.winner).toBe('winner');
    });

    it('should track total number of rounds', () => {
        const lottery = new MockLottery();
        lottery.startNewRound();
        lottery.startNewRound();
        lottery.startNewRound();

        expect(lottery.getTotalRounds()).toBe(3);
    });
});