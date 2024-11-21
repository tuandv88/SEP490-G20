import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PropTypes from 'prop-types'

function AlgorithmStatsList({ stats }) {
  if (!stats || stats.length === 0) {
    return (
      <Card className='bg-card text-card-foreground'>
        <CardHeader>
          <CardTitle>Algorithm Statistics</CardTitle>
          <CardDescription>No algorithm statistics available at the moment</CardDescription>
        </CardHeader>
      </Card>
    )
  }
  return (
    <Card className='bg-card text-card-foreground'>
      <CardHeader>
        <CardTitle>Algorithm Statistics</CardTitle>
        <CardDescription>Performance across different algorithm types</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className='space-y-4'>
          {stats.map((stat) => (
            <li key={stat.name} className='flex items-center justify-between'>
              <div>
                <p className='font-medium'>{stat.name}</p>
                <p className='text-sm text-muted-foreground'>{stat.submissions} submissions</p>
              </div>
              <p className='font-medium'>Avg. Score: {stat.avgScore}%</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
AlgorithmStatsList.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      submissions: PropTypes.number.isRequired,
      avgScore: PropTypes.number.isRequired
    })
  ).isRequired
}
export default AlgorithmStatsList
