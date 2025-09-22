'use client'

import React from 'react'
import { ArrowLeft, Book, Clock, GraduationCap, FileText, Target, User } from 'lucide-react'
import Link from 'next/link'
import { useGetStudentCourse } from '@/hooks/student/useGetStudentCourse'

// Types (matching the API response format)
interface Lesson {
  _id: string
  title: string
  description: string
  objectives: string
  readingList: string[]
  estHoursPerWeek: number
  designerId: {
    name: string
  }
  credit: number
  status: 'draft' | 'active' | 'archived'
}

interface Course {
  _id: string
  courseId: string
  title: string
  credits: number
  status: 'active' | 'inactive'
  courseDirectorId: {
    name: string
    email: string
  }
  lessonIds: any[] // Using any[] to match the populated response
  enrolledStudentIds: any[] // This comes from the API
  description?: string
}

export default function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
  // Unwrap the params Promise using React.use()
  const { courseId } = React.use(params)
  const { course, loading, error, refetchCourse } = useGetStudentCourse(courseId)
  
  // Type the course properly
  const typedCourse = course as Course | null

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-lg text-gray-700">Loading course details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !typedCourse) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Course</h2>
            <p className="text-red-600 mb-4">{error || 'Course not found'}</p>
            <Link 
              href="/student/courses"
              className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const activeLessons = typedCourse.lessonIds?.filter((lesson: any) => lesson.status === 'active') || []
  const totalHours = activeLessons.reduce((sum: number, lesson: any) => sum + (lesson.estHoursPerWeek || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link 
            href="/student/courses"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Courses
          </Link>
        </div>

        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 border border-gray-200">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{typedCourse.title}</h1>
              <p className="text-lg text-blue-600 font-semibold">{typedCourse.courseId}</p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                typedCourse.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {typedCourse.status}
              </div>
            </div>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GraduationCap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Credits</p>
                <p className="font-semibold text-gray-900">{typedCourse.credits}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Book className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Lessons</p>
                <p className="font-semibold text-gray-900">{activeLessons.length}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Est. Hours/Week</p>
                <p className="font-semibold text-gray-900">{totalHours}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <User className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Course Director</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {typedCourse.courseDirectorId?.name || 'Not assigned'}
                </p>
              </div>
            </div>
          </div>

          {/* Course Description */}
          {typedCourse.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Description</h3>
              <p className="text-gray-700 leading-relaxed">{typedCourse.description}</p>
            </div>
          )}
        </div>

        {/* Course Director Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Course Director
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {typedCourse.courseDirectorId?.name || 'Not assigned'}
                </p>
                {typedCourse.courseDirectorId?.email && (
                  <p className="text-sm text-gray-600">{typedCourse.courseDirectorId.email}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Book className="h-5 w-5 mr-2 text-blue-600" />
            Lessons ({activeLessons.length})
          </h2>

          {activeLessons.length > 0 ? (
            <div className="space-y-4">
              {activeLessons.map((lesson: any, index: number) => (
                <div key={lesson._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                          Lesson {index + 1}
                        </span>
                        <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded">
                          {lesson.credit} credits
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                      {lesson.description && (
                        <p className="text-gray-600 mb-3">{lesson.description}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {lesson.estHoursPerWeek} hrs/week
                      </div>
                      <div className="text-sm text-gray-500">
                        Designer: {lesson.designerId?.name || 'Unknown'}
                      </div>
                    </div>
                  </div>

                  {/* Lesson Objectives */}
                  {lesson.objectives && (
                    <div className="mb-4">
                      <h4 className="flex items-center text-sm font-medium text-gray-900 mb-2">
                        <Target className="h-4 w-4 mr-1" />
                        Learning Objectives
                      </h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {lesson.objectives}
                      </p>
                    </div>
                  )}

                  {/* Reading List */}
                  {lesson.readingList && lesson.readingList.length > 0 && (
                    <div>
                      <h4 className="flex items-center text-sm font-medium text-gray-900 mb-2">
                        <FileText className="h-4 w-4 mr-1" />
                        Reading List
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {lesson.readingList.map((reading: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-600 mr-2">&#8226;</span>
                            {reading}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Book className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No active lessons available for this course.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}