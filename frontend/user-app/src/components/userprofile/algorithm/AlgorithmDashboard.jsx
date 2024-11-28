import React from 'react';
import { AlgorithmStats } from './AlgorithmStats';
import { ProblemList } from './ProblemList';

export function AlgorithmDashboard() {
  return (
    <div className="space-y-6 mt-6">
      <AlgorithmStats />
      <ProblemList />
    </div>
  );
}