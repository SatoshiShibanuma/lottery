import React from 'react';
import { LotteryForm } from '../components/lottery/LotteryForm';
import { LotteryHistoryView } from '../components/lottery/LotteryHistoryView';

const LotteryPage: React.FC = () => {
  return (
    <div className="lottery-page">
      <h1>Lottery Game</h1>
      <div className="lottery-content">
        <div className="lottery-entry">
          <LotteryForm />
        </div>
        <div className="lottery-history">
          <LotteryHistoryView />
        </div>
      </div>
    </div>
  );
};

export default LotteryPage;