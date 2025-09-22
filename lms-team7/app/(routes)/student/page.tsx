'use client'

import { useGetUser } from '@/hooks/useGetUser'

// Types
interface Course {
  _id?: string
  courseId: string
  title: string
  status: 'active' | 'completed' | 'inactive'
  credits: number
  description?: string
  courseDirectorId?: {
    name: string
  }
  lessonIds?: any[]
}

interface User {
  name: string
  status: string
  dateEnrolled?: string
  enrolledCourses?: Course[]
  currentCreditPoints?: number
}

// Course Card Component
const CourseCard = ({ course }: { course: Course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
          <p className="text-sm text-blue-600 font-medium">{course.courseId}</p>
        </div>
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {course.status}
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Coordinator:</span>
          <span className="font-medium text-gray-900">
            {course.courseDirectorId?.name || 'Not assigned'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Credits:</span>
          <span className="font-medium text-gray-900">{course.credits}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Lessons:</span>
          <span className="font-medium text-gray-900">
            {course.lessonIds?.length || 0} lessons
          </span>
        </div>
      </div>

      {course.description && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
          {course.description}
        </p>
      )}
    </div>
  )
}

// Progress Tracker Component
const ProgressTracker = ({ user }: { user: User }) => {
  if (!user) return null

  const enrolledCourses = user.enrolledCourses || []
  const coursesEnrolled = enrolledCourses.length
  const coursesCompleted = enrolledCourses.filter((course: Course) => course.status === 'completed').length
  const coursesInProgress = enrolledCourses.filter((course: Course) => course.status === 'active').length
  const currentCredits = user.currentCreditPoints || 0

  const stats = [
    {
      title: 'Courses Enrolled',
      value: coursesEnrolled,
      description: 'Total courses you are enrolled in',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'Courses Completed', 
      value: coursesCompleted,
      description: 'Courses you have successfully completed',
      color: 'bg-green-100 text-green-800'
    },
    {
      title: 'Courses In Progress',
      value: coursesInProgress, 
      description: 'Courses currently active',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      title: 'Current Credits',
      value: currentCredits,
      description: 'Total credit points earned',
      color: 'bg-purple-100 text-purple-800'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Progress Tracker</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="p-4 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{stat.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${stat.color}`}>
                {stat.value}
              </span>
            </div>
            <p className="text-sm text-gray-600">{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main Student Dashboard Component
export default function StudentDashboard() {
  const { user, loading, error, refetch } = useGetUser()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-lg text-gray-700">Loading your dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={refetch}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No User Data Found</h2>
            <p className="text-gray-600">Unable to load your profile information.</p>
          </div>
        </div>
      </div>
    )
  }

  const enrolledCourses = (user as User)?.enrolledCourses || []

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {(user as User)?.name}!</h1>
              <p className="text-gray-600 mt-1">
                Student Dashboard - Enrolled since {(user as User)?.dateEnrolled ? new Date((user as User).dateEnrolled!).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                (user as User)?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {(user as User)?.status}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mb-8">
          <ProgressTracker user={user as User} />
        </div>

        {/* Enrolled Courses Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              My Courses ({enrolledCourses.length})
            </h2>
            <button
              onClick={refetch}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Refresh"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course: Course) => (
                <CourseCard key={course._id || course.courseId} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Enrolled</h3>
              <p className="text-gray-600">You are not currently enrolled in any courses.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
