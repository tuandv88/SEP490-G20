import { ProblemAPI } from '@/services/api/problemApi'
import { AlgorithmList } from '../problem_discuss/AlgorithmList'
import { DiscussionList } from '../problem_discuss/DiscussionList'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { AUTHENTICATION_ROUTERS } from '@/data/constants'
import { useEffect, useState } from 'react'
import { DashboardSkeleton } from '../loading/DashboardSkeleton'
import { DiscussApi } from '@/services/api/DiscussApi'
import { UserAPI } from '@/services/api/userApi'

export const algorithms = [
  {
    id: '1',
    title: 'Two Sum',
    description: 'Find two numbers in an array that add up to a target sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    likes: 452,
    submissions: 1250,
    successRate: 85
  },
  {
    id: '2',
    title: 'Binary Tree Level Order Traversal',
    description: 'Traverse a binary tree in level order (breadth-first search)',
    difficulty: 'Medium',
    category: 'Trees',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    likes: 328,
    submissions: 850,
    successRate: 72
  },
  {
    id: '3',
    title: 'Merge K Sorted Lists',
    description: 'Merge k sorted linked lists into one sorted linked list',
    difficulty: 'Hard',
    category: 'Linked Lists',
    timeComplexity: 'O(n log k)',
    spaceComplexity: 'O(n)',
    likes: 275,
    submissions: 620,
    successRate: 65
  }
]

// export const discussions = [
//   {
//     id: '1',
//     title: 'Understanding Dynamic Programming: A Comprehensive Guide',
//     preview:
//       "I've created a detailed guide on approaching dynamic programming problems with examples and common patterns...",
//     author: {
//       id: 'user1',
//       name: 'Sarah Chen',
//       avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
//     },
//     likes: 234,
//     replies: 45,
//     timeAgo: '2h ago'
//   },
//   {
//     id: '2',
//     title: 'Tips for Optimizing Array Manipulation Problems',
//     preview: "Here are some techniques I've found helpful when dealing with array manipulation challenges...",
//     author: {
//       id: 'user2',
//       name: 'Alex Kumar',
//       avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
//     },
//     likes: 156,
//     replies: 32,
//     timeAgo: '4h ago'
//   },
//   {
//     id: '3',
//     title: 'From Leetcode to Real-World: Applying Algorithm Skills',
//     preview: "Let's discuss how algorithm practice translates to actual software engineering scenarios...",
//     author: {
//       id: 'user3',
//       name: 'Maria Garcia',
//       avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
//     },
//     likes: 189,
//     replies: 28,
//     timeAgo: '6h ago'
//   }
// ]

export function ProblemSection({}) {
  const navigate = useNavigate()
  const [problems, setProblems] = useState([])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [discussions, setDiscussions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [problemData, discussionData] = await Promise.all([
          ProblemAPI.getProblemHome(1, 8),
          DiscussApi.getDiscussionHome()
        ]);

        const discussionsWithUserDetails = await Promise.all(
          discussionData.discussionsTopDtos.map(async (discussion) => {
            try {
              const userResponse = await UserAPI.getUserById(discussion.userId);
              return {
                ...discussion,
                userName: userResponse.firstName + ' ' + userResponse.lastName,
                avatar: userResponse.urlProfilePicture
              };
            } catch (userError) {
              console.error('Error fetching user data:', userError);
              return {
                ...discussion,
                userName: 'Unknown User',
                avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
              };
            }
          })
        );

        setProblems(problemData.problems.data);
        setDiscussions(discussionsWithUserDetails);
      } catch (err) {
        setError(err);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <DashboardSkeleton />
  if (error) return <div>Error loading problems.</div>

  const mediumCount = problems.filter((item) => item.difficulty === 'Medium').length

  // Đếm số lượng phần tử có difficulty = 'True'
  const trueCount = problems.filter((item) => item.difficulty === 'True').length

  // Đếm số lượng phần tử có difficulty = 'Hard'
  const hardCount = problems.filter((item) => item.difficulty === 'Hard').length

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
      <div className='lg:col-span-2 bg-gray-100 rounded-lg shadow-sm p-6'>
        <div className='rounded-lg shadow-sm p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-gray-900'>Practice Problems</h2>
            <Button onClick={() => navigate(AUTHENTICATION_ROUTERS.PROBLEMS)} variant='outline'>
              View All Problems
            </Button>
          </div>

          <div className='flex gap-4 mt-2'>
            <div className='flex items-center gap-2'>
              <span className='w-3 h-3 bg-green-500 rounded-full'></span>
              <span className='text-sm text-gray-600'>{trueCount} Easy</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='w-3 h-3 bg-yellow-500 rounded-full'></span>
              <span className='text-sm text-gray-600'>{mediumCount} Medium</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='w-3 h-3 bg-red-500 rounded-full'></span>
              <span className='text-sm text-gray-600'>{hardCount} Hard</span>
            </div>
          </div>
        </div>
        <AlgorithmList problems={problems} />
      </div>

      <div>
        <div className='bg-gray-100 rounded-lg shadow-sm p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-gray-900'>Latest Discussions</h2>
          </div>
          <DiscussionList discussions={discussions} />
        </div>
      </div>
    </div>
  )
}




// useEffect(() => {
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [problemData, discussionData] = await Promise.all([
//         ProblemAPI.getProblemHome(1, 8),
//         DiscussApi.getDiscussionHome()
//       ]);

//       setProblems(problemData.problems.data);
//       setDiscussions(discussionData.discussionsTopDtos);
//       console.log('Problems:', problemData);
//       console.log('Discussions:', discussionData);
//     } catch (err) {
//       setError(err);
//       console.error('Error fetching data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, []);