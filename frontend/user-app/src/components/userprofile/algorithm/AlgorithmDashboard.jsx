import React, { useEffect, useState } from 'react';
import { AlgorithmStats } from './AlgorithmStats';
import { ProblemList } from './ProblemList';
import { ProblemAPI } from '@/services/api/problemApi';
import { Skeleton } from '@/components/ui/skeleton';

export function AlgorithmDashboard() {
  const [loading, setLoading] = useState(true);
  const [problemSolved, setProblemSolved] = useState([]);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [solvedResponse, problemsResponse] = await Promise.all([
          ProblemAPI.getProblemSolved(),
          ProblemAPI.getSolvedProblems()
        ]);
        setProblemSolved(solvedResponse.solved);
        setProblems(problemsResponse);
      } catch (error) {
        console.error('Error fetching algorithm data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 mt-6">
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <AlgorithmStats problemSolved={problemSolved} />
      <ProblemList problemSolved={problemSolved} problems={problems} />
    </div>
  );
}
