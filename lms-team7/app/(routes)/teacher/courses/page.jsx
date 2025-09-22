'use client'

import React from 'react'
import Link from 'next/link'
import CourseCard from '@/components/teacher/CourseCard'
import { useGetTeacherCourse } from '@/hooks/teacher/useGetTeacherCourse'

const page = () => {
  const { courses, loading, error, refetchCourses } = useGetTeacherCourse();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-lg text-gray-700">Loading your courses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto flex items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h3 className="font-bold text-red-800">Error loading courses</h3>
            <div className="text-sm text-red-700">{error}</div>
          </div>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors" 
            onClick={refetchCourses}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-600 mb-2">My Courses</h1>
          <p className="text-gray-600">Manage and view all your assigned courses ({courses.length} course{courses.length !== 1 ? 's' : ''})</p>
        </div>
        <div className="flex gap-2">
          <button 
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-colors flex items-center disabled:opacity-50" 
            onClick={refetchCourses}
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <Link href="/teacher/courses/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Course
          </Link>
        </div>
      </div>
      
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={{
              id: course.courseId,
              title: course.title,
              credits: course.credits,
              status: course.status,
              director: course.courseDirectorId,
              lessons: course.lessonIds,
              enrolledStudents: course.enrolledStudentIds
            }} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="text-gray-500 text-lg mb-2">No courses yet</div>
          <p className="text-gray-400 mb-4">You haven't created any courses yet. Get started by creating your first course.</p>
          <Link href="/teacher/courses/create" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
            Create Your First Course
          </Link>
        </div>
      )}
    </div>
  )
}

export default page