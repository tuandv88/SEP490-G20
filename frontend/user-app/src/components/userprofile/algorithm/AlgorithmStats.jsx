import React from 'react'

export function AlgorithmStats({ problemSolved }) {

  const defaultStats = {
    easy: { solvedCount: 0, totalCount: 0 },
    medium: { solvedCount: 0, totalCount: 0 },
    hard: { solvedCount: 0, totalCount: 0 }
  }

  const effectiveProblemSolved = problemSolved || defaultStats

  const stats = [
    {
      label: 'Easy',
      solved: effectiveProblemSolved.easy.solvedCount,
      total: effectiveProblemSolved.easy.totalCount,
      color: 'bg-green-500'
    },
    {
      label: 'Medium',
      solved: effectiveProblemSolved.medium.solvedCount,
      total: effectiveProblemSolved.medium.totalCount,
      color: 'bg-yellow-500'
    },
    {
      label: 'Hard',
      solved: effectiveProblemSolved.hard.solvedCount,
      total: effectiveProblemSolved.hard.totalCount,
      color: 'bg-red-500'
    }
  ]

  if (problemSolved === null) {
    return (
      <div className='bg-white rounded-lg shadow p-6'>
        <div className='text-center text-gray-500'>No Problem Solved</div>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <h2 className='text-xl font-semibold mb-6'>Algorithm Stats</h2>
      <div className='space-y-4'>
        {stats.map((stat, index) => (
          <div key={index}>
            <div className='flex justify-between mb-1'>
              <span className='text-sm font-medium'>{stat.label}</span>
              <span className='text-sm text-gray-500'>
                {stat.solved}/{stat.total}
              </span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              {stat.solved !== 0 && (
                <div
                  className={`${stat.color} h-2 rounded-full`}
                  style={{ width: `${(stat.solved / stat.total) * 100}%` }}
                ></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
