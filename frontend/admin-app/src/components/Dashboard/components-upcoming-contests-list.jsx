import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PropTypes from 'prop-types'

function UpcomingContestsList({ contests }) {
  return (
    <Card className='bg-card text-card-foreground'>
      <CardHeader>
        <CardTitle>Upcoming Contests</CardTitle>
        <CardDescription>Upcoming programming contests</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className='space-y-4'>
          {contests.map((contest) => (
            <li key={contest.id} className='flex items-center justify-between'>
              <div>
                <p className='font-medium'>{contest.name}</p>
                <p className='text-sm text-muted-foreground'>{new Date(contest.date).toLocaleDateString()}</p>
              </div>
              <p className='text-sm'>{contest.participants} participants</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
UpcomingContestsList.propTypes = {
  contests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      participants: PropTypes.number.isRequired
    })
  ).isRequired
}
export default UpcomingContestsList
