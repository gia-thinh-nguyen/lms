'use client'

import { useRouter } from 'next/navigation'

const CourseCard = ({ course }) => {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/teacher/courses/${course.id}`)
  }

  return (
    <div 
      className="card w-full bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
      onClick={handleCardClick}
    >
      <div className="card-body">
        <h2 className="card-title text-primary">
          {course.title}
          <div className="badge badge-secondary">{course.status}</div>
        </h2>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-600">Course ID:</span>
            <span className="badge badge-outline">{course.id}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-600">Director:</span>
            <span className="font-semibold">{course.director?.name || 'Not assigned'}</span>
          </div>
          
          {course.credits && (
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Credits:</span>
              <div className="badge badge-accent">{course.credits}</div>
            </div>
          )}
          
          {course.lessons && (
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Lessons:</span>
              <span className="text-sm">{course.lessons.length} available</span>
            </div>
          )}
        </div>
        
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary btn-sm">
            View Course
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourseCard