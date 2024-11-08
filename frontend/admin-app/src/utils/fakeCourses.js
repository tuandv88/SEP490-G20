export const fakeCourses = Array.from({ length: 30 }, (_, i) => ({
  id: `course-${i + 1}`,
  title: `Course ${i + 1}`,
  timeEstimate: Math.floor(Math.random() * 50) + 1,
  scheduledPublishDate: new Date(Date.now() + Math.random() * 10000000000),
  courseStatus: ['Draft', 'Published', 'Scheduled', 'Archived'][Math.floor(Math.random() * 4)],
  courseLevel: ['Basic', 'Intermediate', 'Advanced', 'Expert'][Math.floor(Math.random() * 4)],
  price: Math.floor(Math.random() * 200) + 1
}))
