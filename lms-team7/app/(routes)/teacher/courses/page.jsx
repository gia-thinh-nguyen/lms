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
          <div className="loading loading-spinner loading-lg"></div>
          <span className="ml-4 text-lg">Loading your courses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-error max-w-2xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold">Error loading courses</h3>
            <div className="text-xs">{error}</div>
          </div>
          <button className="btn btn-sm" onClick={refetchCourses}>
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
          <h1 className="text-3xl font-bold text-primary mb-2">My Courses</h1>
          <p className="text-gray-600">Manage and view all your assigned courses ({courses.length} course{courses.length !== 1 ? 's' : ''})</p>
        </div>
        <div className="flex gap-2">
          <button 
            className="btn btn-ghost" 
            onClick={refetchCourses}
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <Link href="/teacher/courses/create" className="btn btn-primary">
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
          <Link href="/teacher/courses/create" className="btn btn-primary">
            Create Your First Course
          </Link>
        </div>
      )}
    </div>
  )
}

export default page