import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PropTypes from 'prop-types'

function AlgorithmStatsList({ stats }) {
  if (!stats || stats.length === 0) {
    return (
      <Card className='bg-card text-card-foreground'>
        <CardHeader>
          <CardTitle>Top 4 Algorithm Submitted</CardTitle>
          <CardDescription>No algorithm statistics available at the moment</CardDescription>
        </CardHeader>
      </Card>
    )
  }
  return (
    <Card className='bg-card text-card-foreground'>
      <CardHeader>
        <CardTitle>Top 4 Algorithm Submitted</CardTitle>
        <CardDescription>Performance across different algorithm types</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className='space-y-4'>
          {stats?.map((stat) => (
            <li key={stat.problemId} className='flex items-center justify-between'>
              <div>
                <p className='font-medium'>{stat.title}</p>
                <p className='text-sm text-muted-foreground'>{stat.acceptedSubmissions} acceptedSubmissions</p>
              </div>
              <p className='font-medium'>Acceptance Rate (%): {stat.acceptanceRate.toFixed(2)}%</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default AlgorithmStatsList
