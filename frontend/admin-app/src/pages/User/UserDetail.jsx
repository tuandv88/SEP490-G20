import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getUserById } from '@/services/api/userApi'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarIcon, MapPinIcon, PhoneIcon, MailIcon, ArrowLeft } from 'lucide-react'
import { PageContainer } from '@/components/page-container'
import { Link } from '@tanstack/react-router'
import { useMatch } from '@tanstack/react-router'
import { userDetailRoute } from '@/routers/router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
const breadcrumbs = [
  { label: 'UserTable', href: '/user-table' },
  { label: 'UserDetail', href: '/user-detail' }
]
const UserDetail = () => {
  const { params } = useMatch(userDetailRoute.id)
  const { userId } = params
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await getUserById(userId)
        setUser(userData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [userId])

  if (loading) {
    return (
      <Card className='w-full max-w-3xl mx-auto mt-8'>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center space-x-4'>
            <Skeleton className='h-12 w-12 rounded-full' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-[250px]' />
              <Skeleton className='h-4 w-[200px]' />
            </div>
          </div>
          <Skeleton className='h-4 w-[300px]' />
          <Skeleton className='h-4 w-[250px]' />
          <Skeleton className='h-4 w-[200px]' />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className='w-full max-w-3xl mx-auto mt-8'>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-red-500'>Failed to load user details: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <PageContainer breadcrumbs={breadcrumbs}>
      <div className='container mx-auto px-4 py-8'>
        <Button variant='outline' asChild className='mb-6'>
          <Link to='/user-table'>
            <ArrowLeft className='mr-2 h-4 w-4' /> Back to Users
          </Link>
        </Button>
        <Card className='w-full max-w-4xl mx-auto'>
          <CardHeader className='pb-0'>
            <div className='flex items-center space-x-4'>
              <Avatar className='h-24 w-24 border-4 border-primary'>
                <AvatarImage src={user.urlProfilePicture} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className='text-2xl'>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className='text-3xl font-bold mb-1'>
                  {user.firstName} {user.lastName}
                </CardTitle>
                <p className='text-muted-foreground text-lg'>@{user.userName}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className='pt-6'>
            <Tabs defaultValue='personal' className='w-full'>
              <TabsList className='grid w-full grid-cols-3'>
                <TabsTrigger value='personal'>Personal Info</TabsTrigger>
                <TabsTrigger value='address'>Address</TabsTrigger>
                <TabsTrigger value='social'>Social Media</TabsTrigger>
              </TabsList>
              <TabsContent value='personal' className='mt-6 space-y-4'>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <p className='flex items-center gap-2 text-lg'>
                      <MailIcon className='h-5 w-5 text-primary' />
                      {user.email}
                    </p>
                    <p className='flex items-center gap-2 text-lg'>
                      <PhoneIcon className='h-5 w-5 text-primary' />
                      {user.phoneNumber}
                    </p>
                    <p className='flex items-center gap-2 text-lg'>
                      <CalendarIcon className='h-5 w-5 text-primary' />
                      {new Date(user.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value='address' className='mt-6 space-y-4'>
                <div className='space-y-2'>
                  <p className='flex items-center gap-2 text-lg'>
                    <MapPinIcon className='h-5 w-5 text-primary' />
                    {user.address.province || 'N/A'}, {user.address.district || 'N/A'}
                  </p>
                  <p className='text-lg pl-7'>{user.address.school || 'N/A'}</p>
                </div>
              </TabsContent>
              <TabsContent value='social' className='mt-6'>
                <div className='space-y-4'>
                  {user.bio.facebook && (
                    <Button variant='outline' asChild className='w-full justify-start'>
                      <a href={user.bio.facebook} target='_blank' rel='noopener noreferrer'>
                        <Facebook className='mr-2 h-4 w-4' /> Facebook Profile
                      </a>
                    </Button>
                  )}
                  {user.bio.linkedIn && (
                    <Button variant='outline' asChild className='w-full justify-start'>
                      <a href={user.bio.linkedIn} target='_blank' rel='noopener noreferrer'>
                        <Linkedin className='mr-2 h-4 w-4' /> LinkedIn Profile
                      </a>
                    </Button>
                  )}
                  {user.bio.twitter && (
                    <Button variant='outline' asChild className='w-full justify-start'>
                      <a href={user.bio.twitter} target='_blank' rel='noopener noreferrer'>
                        <Twitter className='mr-2 h-4 w-4' /> Twitter Profile
                      </a>
                    </Button>
                  )}
                  {!user.bio.facebook && !user.bio.linkedIn && !user.bio.twitter && (
                    <p className='text-muted-foreground text-center'>No social media profiles provided</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}

export default UserDetail
