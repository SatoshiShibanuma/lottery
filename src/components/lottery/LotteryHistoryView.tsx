import React, { useState, useEffect } from 'react';
import { useLotteryContract } from '../../hooks/useLotteryContract';

export interface LotteryRound {
  id: number;
  timestamp: number;
  potSize: string;
  winner: string;
  participants: number;
}

export const LotteryHistoryView: React.FC = () => {
  const [history, setHistory] = useState<LotteryRound[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useLotteryContract();

  useEffect(() => {
    const fetchLotteryHistory = async () => {
      try {
        setIsLoading(true);
        if (!contract) {
          throw new Error('Lottery contract not initialized');
        }

        // Fetch lottery history from the contract
        const rounds = await contract.getPastRounds();
        
        // Transform contract data into LotteryRound format
        const formattedRounds = rounds.map((round: any) => ({
          id: round.id.toNumber(),
          timestamp: round.timestamp.toNumber(),
          potSize: round.potSize.toString(),
          winner: round.winner,
          participants: round.participants.toNumber()
        }));

        setHistory(formattedRounds);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Unknown error fetching lottery history';
        setError(errorMessage);
        console.error('Lottery History Fetch Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLotteryHistory();
  }, [contract]);

  if (isLoading) {
    return <div data-testid="history-loading">Loading lottery history...</div>;
  }

  if (error) {
    return (
      <div data-testid="history-error" className="error-message">
        {error}
      </div>
    );
  }

  return (
    <div className="lottery-history" data-testid="lottery-history">
      <h2>Lottery History</h2>
      {history.length === 0 ? (
        <p data-testid="no-history">No past lottery rounds</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Round</th>
              <th>Date</th>
              <th>Pot Size</th>
              <th>Winner</th>
              <th>Participants</th>
            </tr>
          </thead>
          <tbody>
            {history.map((round) => (
              <tr key={round.id} data-testid={`round-${round.id}`}>
                <td>{round.id}</td>
                <td>{new Date(round.timestamp * 1000).toLocaleString()}</td>
                <td>{round.potSize} ETH</td>
                <td>{round.winner}</td>
                <td>{round.participants}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};