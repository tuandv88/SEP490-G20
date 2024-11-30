import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export function ProblemList({ problems }) {
  console.log(problems)
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Hard':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Solved Problems</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acceptance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {problems.map((problem) => (
              <tr key={problem.problemsId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{problem.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {problem.acceptance !== -1 ? problem.acceptance + '%' : '0%'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
}