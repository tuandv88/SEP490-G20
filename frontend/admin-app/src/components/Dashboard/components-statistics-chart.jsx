import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PropTypes from 'prop-types'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

function StatisticsChart({ courseEnrollmentData, userDistributionData, revenueGrowthData, topEnrolledCourses }) {
  const [activeTab, setActiveTab] = useState('courseEnrollment')

  return (
    <Card className='mb-8 bg-card text-card-foreground'>
      <CardHeader className='flex flex-col items-center pb-2 space-y-4'>
        <CardTitle className='text-2xl font-semibold text-center'>Comprehensive Statistics</CardTitle>
        <div className='flex flex-wrap justify-center w-full max-w-3xl gap-3 mx-auto'>
          <Button
            size='sm'
            variant={activeTab === 'courseEnrollment' ? 'default' : 'outline'}
            onClick={() => setActiveTab('courseEnrollment')}
            className='min-w-[140px]'
          >
            Course Enrollment
          </Button>
          <Button
            size='sm'
            variant={activeTab === 'userDistribution' ? 'default' : 'outline'}
            onClick={() => setActiveTab('userDistribution')}
            className='min-w-[140px]'
          >
            User Distribution
          </Button>
          <Button
            size='sm'
            variant={activeTab === 'revenueGrowth' ? 'default' : 'outline'}
            onClick={() => setActiveTab('revenueGrowth')}
            className='min-w-[140px]'
          >
            Revenue Growth
          </Button>
          <Button
            size='sm'
            variant={activeTab === 'topCourses' ? 'default' : 'outline'}
            onClick={() => setActiveTab('topCourses')}
            className='min-w-[140px]'
          >
            Top Courses
          </Button>
        </div>
      </CardHeader>
      <CardContent className='flex items-center justify-center px-4 py-6'>
        <div className='w-full max-w-5xl mx-auto'>
          <ChartContainer
            config={{
              'Web Development': {
                label: 'Web Development',
                color: 'hsl(var(--chart-1))'
              },
              'Data Science': {
                label: 'Data Science',
                color: 'hsl(var(--chart-2))'
              },
              'Mobile App': {
                label: 'Mobile App',
                color: 'hsl(var(--chart-3))'
              },
              revenue: {
                label: 'Revenue',
                color: 'hsl(var(--chart-4))'
              },
              enrollments: {
                label: 'Enrollments',
                color: 'hsl(var(--chart-5))'
              }
            }}
            className='h-[400px]'
          >
            <ResponsiveContainer width='100%' height='100%'>
              {activeTab === 'courseEnrollment' && (
                <BarChart data={courseEnrollmentData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray='3 3' strokeOpacity={0.5} />
                  <XAxis dataKey='month' tick={{ fontSize: 13 }} />
                  <YAxis tick={{ fontSize: 13 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend wrapperStyle={{ fontSize: '13px', marginTop: '15px' }} />
                  <Bar dataKey='Web Development' stackId='a' fill='hsl(var(--chart-1))' />
                  <Bar dataKey='Data Science' stackId='a' fill='hsl(var(--chart-2))' />
                  <Bar dataKey='Mobile App' stackId='a' fill='hsl(var(--chart-3))' />
                </BarChart>
              )}
              {activeTab === 'userDistribution' && (
                <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <Pie
                    data={userDistributionData}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    outerRadius={140}
                    fill='hsl(var(--chart-1))'
                    label={{ fontSize: 13 }}
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${index + 1}))`} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend wrapperStyle={{ fontSize: '13px', marginTop: '15px' }} />
                </PieChart>
              )}
              {activeTab === 'revenueGrowth' && (
                <LineChart data={revenueGrowthData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray='3 3' strokeOpacity={0.5} />
                  <XAxis dataKey='month' tick={{ fontSize: 13 }} />
                  <YAxis tick={{ fontSize: 13 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend wrapperStyle={{ fontSize: '13px', marginTop: '15px' }} />
                  <Line
                    type='monotone'
                    dataKey='revenue'
                    stroke='hsl(var(--chart-4))'
                    strokeWidth={2}
                    dot={{ strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              )}
              {activeTab === 'topCourses' && (
                <BarChart
                  layout='vertical'
                  data={topEnrolledCourses}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray='3 3' strokeOpacity={0.5} />
                  <XAxis type='number' tick={{ fontSize: 13 }} />
                  <YAxis dataKey='name' type='category' width={150} tick={{ fontSize: 13 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend wrapperStyle={{ fontSize: '13px', marginTop: '15px' }} />
                  <Bar dataKey='enrollments' fill='hsl(var(--chart-5))' />
                </BarChart>
              )}
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
StatisticsChart.propTypes = {
  courseEnrollmentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  userDistributionData: PropTypes.arrayOf(PropTypes.object).isRequired,
  revenueGrowthData: PropTypes.arrayOf(PropTypes.object).isRequired,
  topEnrolledCourses: PropTypes.arrayOf(PropTypes.object).isRequired
}
export default StatisticsChart
