import { DiscussionTable } from '@/components/Discussion/DiscussionTable'
import { getAllDiscussions } from '@/services/discussionApi'
import { useQuery } from '@tanstack/react-query'
import { PageContainer } from '@/components/PageContainer'
import { DISCUSSION_TABLE_PATH } from '@/routers/router'
// This is a mock function to simulate fetching data from an API

export default function DiscussionsPage() {
  const breadcrumbs = [{ label: 'Discussions', href: DISCUSSION_TABLE_PATH }]
  const {
    data: discussions,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['discussions'],
    queryFn: getAllDiscussions
  })

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>Loading...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>Error: {error.message}</p>
      </div>
    )
  }
  return (
    <PageContainer breadcrumbs={breadcrumbs}>
      <DiscussionTable data={discussions} />
    </PageContainer>
  )
}
