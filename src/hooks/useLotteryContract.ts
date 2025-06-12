import { useState, useEffect } from 'react';

export const useLotteryContract = () => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    // Mock contract initialization logic
    const mockContract = {
      getPastRounds: async () => [
        {
          id: { toNumber: () => 1 },
          timestamp: { toNumber: () => 1625097600 },
          potSize: { toString: () => '5' },
          winner: '0x123456789',
          participants: { toNumber: () => 10 }
        }
      ]
    };

    setContract(mockContract as any);
  }, []);

  return { contract };
};