import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PropTypes from 'prop-types'

function OverviewCard({ title, value, change, icon: Icon }) {
  return (
    <Card className='bg-card text-card-foreground'>
      <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='w-4 h-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-muted-foreground'>{change}</p>
      </CardContent>
    </Card>
  )
}
OverviewCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.string,
  icon: PropTypes.elementType
}
export default OverviewCard
