import React from 'react';
import { AlgorithmStats } from './AlgorithmStats';
import { ProblemList } from './ProblemList';

export function AlgorithmDashboard({ problemSolved, problems }) {
  return (
    <div className="space-y-6 mt-6">
      <AlgorithmStats problemSolved={problemSolved} />
      <ProblemList problemSolved={problemSolved} problems={problems} />
    </div>
  );
}