'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useGetSpecificCourse } from '@/hooks/teacher/useGetSpecificCourse'

const CoursePage = () => {
  const params = useParams()
  const courseId = params.courseId
  const { course, loading, error, refetchCourse } = useGetSpecificCourse(courseId)

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-4 text-lg">Loading course...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-error mb-4">Error Loading Course</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button onClick={refetchCourse} className="btn btn-primary">
              Try Again
            </button>
            <Link href="/teacher/courses" className="btn btn-outline">
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-error mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6">The course with ID "{courseId}" could not be found.</p>
          <Link href="/teacher/courses" className="btn btn-primary">
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <div className="breadcrumbs text-sm mb-6">
        <ul>
          <li><Link href="/teacher">Dashboard</Link></li>
          <li><Link href="/teacher/courses">Courses</Link></li>
          <li>{course.title}</li>
        </ul>
      </div>

      {/* Course Header */}
      <div className="bg-base-100 rounded-lg shadow-xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-primary">{course.title}</h1>
              <div className={`badge ${course.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                {course.status}
              </div>
            </div>
            <p className="text-gray-600 mb-4">Course ID: {course.courseId}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="btn btn-primary">Edit Course</button>
          </div>
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Course ID</div>
            <div className="stat-value text-2xl">{course.courseId}</div>
          </div>
          
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Credits</div>
            <div className="stat-value text-2xl">{course.credits}</div>
          </div>
          
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Total Lessons</div>
            <div className="stat-value text-2xl">{course.lessonIds?.length || 0}</div>
          </div>
        </div>
      </div>

      {/* Course Director */}
      <div className="bg-base-100 rounded-lg shadow-xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Course Director</h2>
        <div className="flex items-center gap-4">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-12">
              <span className="text-xl">{course.courseDirectorId?.name?.split(' ').map(n => n[0]).join('') || '?'}</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">{course.courseDirectorId?.name || 'Unknown'}</h3>
            <p className="text-gray-600">{course.courseDirectorId?.email || 'Course Director'}</p>
          </div>
        </div>
      </div>

      {/* Enrolled Students */}
      <div className="bg-base-100 rounded-lg shadow-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Enrolled Students</h2>
          <div className="badge badge-info">{course.enrolledStudentIds?.length || 0} Students</div>
        </div>
        
        {course.enrolledStudentIds && course.enrolledStudentIds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {course.enrolledStudentIds.map((student, index) => (
              <div key={student._id || index} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-10">
                    <span className="text-sm">{student.name?.split(' ').map(n => n[0]).join('') || '?'}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">{student.name || 'Unknown Student'}</h4>
                  <p className="text-sm text-gray-600">{student.email || 'No email'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No students enrolled in this course yet.
          </div>
        )}
      </div>

      {/* Lessons */}
      <div className="bg-base-100 rounded-lg shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Course Lessons</h2>
          <Link href={`/teacher/courses/${courseId}/lessons/create`} className="btn btn-sm btn-primary">Add Lesson</Link>
        </div>
        
        <div className="space-y-3">
          {course.lessonIds && course.lessonIds.length > 0 ? (
            course.lessonIds.map((lesson, index) => (
              <div key={lesson._id || index} className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="badge badge-outline">{index + 1}</div>
                  <span className="font-medium">{lesson.title || `Lesson ${index + 1}`}</span>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-sm btn-ghost">Edit</button>
                  <button className="btn btn-sm btn-primary">View</button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No lessons available for this course yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CoursePage