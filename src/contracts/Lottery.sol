// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Lottery {
    // Struct to track detailed lottery round information
    struct LotteryRound {
        uint256 roundId;
        uint256 startTime;
        uint256 endTime;
        uint256 potSize;
        address[] participants;
        address winner;
        bool isComplete;
    }

    // Mapping to store lottery rounds by their ID
    mapping(uint256 => LotteryRound) public lotteryRounds;
    
    // Current round tracking
    uint256 public currentRoundId = 0;

    // Events for lottery round lifecycle
    event LotteryRoundStarted(uint256 indexed roundId, uint256 startTime);
    event ParticipantAdded(uint256 indexed roundId, address participant);
    event LotteryRoundCompleted(uint256 indexed roundId, address winner, uint256 potSize);

    // Function to start a new lottery round
    function startNewRound() public {
        currentRoundId++;
        
        lotteryRounds[currentRoundId] = LotteryRound({
            roundId: currentRoundId,
            startTime: block.timestamp,
            endTime: 0,
            potSize: 0,
            participants: new address[](0),
            winner: address(0),
            isComplete: false
        });

        emit LotteryRoundStarted(currentRoundId, block.timestamp);
    }

    // Function to add a participant to the current round
    function addParticipant(address participant) public {
        require(!lotteryRounds[currentRoundId].isComplete, "Current round is complete");
        
        lotteryRounds[currentRoundId].participants.push(participant);
        lotteryRounds[currentRoundId].potSize += msg.value;

        emit ParticipantAdded(currentRoundId, participant);
    }

    // Function to complete the current lottery round and record winner
    function completeLotteryRound(address winner) public {
        require(!lotteryRounds[currentRoundId].isComplete, "Round already completed");
        
        lotteryRounds[currentRoundId].endTime = block.timestamp;
        lotteryRounds[currentRoundId].winner = winner;
        lotteryRounds[currentRoundId].isComplete = true;

        emit LotteryRoundCompleted(currentRoundId, winner, lotteryRounds[currentRoundId].potSize);
    }

    // Retrieve detailed round information
    function getLotteryRoundDetails(uint256 roundId) public view returns (LotteryRound memory) {
        require(roundId > 0 && roundId <= currentRoundId, "Invalid round ID");
        return lotteryRounds[roundId];
    }

    // Get total number of rounds
    function getTotalRounds() public view returns (uint256) {
        return currentRoundId;
    }

    // Get participants of a specific round
    function getRoundParticipants(uint256 roundId) public view returns (address[] memory) {
        require(roundId > 0 && roundId <= currentRoundId, "Invalid round ID");
        return lotteryRounds[roundId].participants;
    }
}