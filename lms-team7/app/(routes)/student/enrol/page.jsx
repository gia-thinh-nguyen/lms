"use client";

import { useState } from 'react'
import { useGetAvailableCourses } from '@/hooks/student/useGetAvailableCourses'
import { useEnrollCourse } from '@/hooks/student/useEnrollCourse'

// Course Card Component
const CourseCard = ({ course, onEnroll, isEnrolling }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
          <p className="text-sm text-blue-600 font-medium">{course.courseId}</p>
        </div>
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Available
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Coordinator:</span>
          <span className="text-sm font-medium text-gray-900">
            {course.courseDirectorId?.name || 'Not assigned'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Credits:</span>
          <span className="text-sm font-medium text-gray-900">{course.credits}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Lessons:</span>
          <span className="text-sm font-medium text-gray-900">
            {course.lessonIds?.length || 0} lessons
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Enrolled Students:</span>
          <span className="text-sm font-medium text-gray-900">
            {course.enrolledStudentIds?.length || 0} students
          </span>
        </div>
      </div>

      <button
        onClick={() => onEnroll(course._id)}
        disabled={isEnrolling}
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
          isEnrolling
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isEnrolling ? 'Enrolling...' : 'Enroll in Course'}
      </button>
    </div>
  )
}

export default function EnrolPage() {
  const { courses, loading, error, refetch } = useGetAvailableCourses()
  const { enrollInCourse, loading: enrollLoading, error: enrollError, setError } = useEnrollCourse()
  const [enrollingCourseId, setEnrollingCourseId] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  const handleEnroll = async (courseId) => {
    try {
      setEnrollingCourseId(courseId)
      setError(null)
      setSuccessMessage('')
      
      const result = await enrollInCourse(courseId)
      
      setSuccessMessage(`Successfully enrolled in ${result.course.title}!`)
      
      // Refresh the available courses list after successful enrollment
      setTimeout(() => {
        refetch()
      }, 1000)
      
    } catch (error) {
      console.error('Enrollment failed:', error)
    } finally {
      setEnrollingCourseId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-lg text-gray-700">Loading available courses...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Courses</h2>
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Course Enrollment</h1>
              <p className="text-gray-600 mt-1">
                Enroll in available courses to expand your learning
              </p>
            </div>
            <button
              onClick={refetch}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Refresh courses"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {enrollError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800 font-medium">{enrollError}</p>
            </div>
          </div>
        )}

        {/* Available Courses */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Courses ({courses.length})
          </h2>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onEnroll={handleEnroll}
                  isEnrolling={enrollingCourseId === course._id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Available Courses</h3>
              <p className="text-gray-600">
                There are currently no courses available for enrollment, or you are already enrolled in all available courses.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
