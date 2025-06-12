import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LotteryHistoryView } from './LotteryHistoryView';

// Mock the useLotteryContract hook
vi.mock('../../hooks/useLotteryContract', () => ({
  useLotteryContract: () => ({
    contract: {
      getPastRounds: vi.fn().mockResolvedValue([
        {
          id: { toNumber: () => 1 },
          timestamp: { toNumber: () => 1625097600 },
          potSize: { toString: () => '5' },
          winner: '0x123456789',
          participants: { toNumber: () => 10 }
        }
      ])
    }
  })
}));

describe('LotteryHistoryView', () => {
  it('renders loading state initially', async () => {
    render(<LotteryHistoryView />);
    expect(screen.getByTestId('history-loading')).toBeInTheDocument();
  });

  it('renders lottery history table when data is available', async () => {
    render(<LotteryHistoryView />);
    
    // Wait for the history to load
    const historyTable = await screen.findByTestId('lottery-history');
    expect(historyTable).toBeInTheDocument();

    // Check specific row details
    const roundRow = screen.getByTestId('round-1');
    expect(roundRow).toBeInTheDocument();
    expect(roundRow).toHaveTextContent('1');
    expect(roundRow).toHaveTextContent('5 ETH');
    expect(roundRow).toHaveTextContent('0x123456789');
  });
});