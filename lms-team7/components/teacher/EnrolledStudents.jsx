'use client'

import { useState, useMemo } from 'react'
import { useEnrollStudents } from '@/hooks/teacher/useEnrollStudents'

const EnrolledStudents = ({ course, students, onCourseUpdate }) => {
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [searchEmail, setSearchEmail] = useState('')
  const { enrollStudents, loading, error, success, resetState } = useEnrollStudents()

  // Filter out students who are already enrolled in the course and apply search filter
  const availableStudents = useMemo(() => {
    if (!students || !course?.enrolledStudentIds) return []
    
    const enrolledClerkIds = course.enrolledStudentIds.map(student => student.clerkId || student._id)
    
    let filtered = students.filter(student => 
      !enrolledClerkIds.includes(student.id)
    )

    // Apply email search filter
    if (searchEmail.trim()) {
      filtered = filtered.filter(student => 
        student.emailAddress?.toLowerCase().includes(searchEmail.toLowerCase())
      )
    }

    return filtered
  }, [students, course, searchEmail])

  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId)
      } else {
        return [...prev, studentId]
      }
    })
  }

  const handleEnrollStudents = async () => {
    if (selectedStudents.length === 0) return
    
    const result = await enrollStudents(course.courseId, selectedStudents)
    
    if (result.success) {
      setShowEnrollModal(false)
      setSelectedStudents([])
      onCourseUpdate(result.data) // Update the course data in parent
    }
  }

  const handleCloseModal = () => {
    setShowEnrollModal(false)
    setSelectedStudents([])
    setSearchEmail('')
    resetState()
  }

  return (
    <>
      <div className="bg-base-100 rounded-lg shadow-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Enrolled Students ({course.enrolledStudentIds?.length || 0})</h2>
          <div className="flex items-center gap-3">
            {availableStudents.length > 0 && (
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => setShowEnrollModal(true)}
              >
                Enroll Students
              </button>
            )}
          </div>
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
            {availableStudents.length > 0 && (
              <div className="mt-2">
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowEnrollModal(true)}
                >
                  Enroll Your First Students
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enroll Students Modal */}
      {showEnrollModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Enroll Students in Course</h3>
            
            {error && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Students enrolled successfully!</span>
              </div>
            )}

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Select students to enroll in "{course.title}":
              </p>
              
              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search students by email..."
                    className="input input-bordered w-full pl-10"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    disabled={loading}
                  />
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {availableStudents.length > 0 ? (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {availableStudents.map((student, index) => (
                    <label key={student.id || `student-${index}`} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleStudentSelect(student.id)}
                        disabled={loading}
                      />
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-8">
                          <span className="text-xs">{`${student.firstName || ''}${student.lastName || ''}`.split(' ').map(n => n[0]).join('') || '?'}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">{`${student.firstName || ''} ${student.lastName || ''}`.trim()}</h4>
                        <p className="text-sm text-gray-600">{student.emailAddress}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  All available students are already enrolled in this course.
                </div>
              )}
            </div>

            <div className="modal-action">
              <button 
                className="btn btn-ghost" 
                onClick={handleCloseModal}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleEnrollStudents}
                disabled={loading || selectedStudents.length === 0}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Enrolling...
                  </>
                ) : (
                  `Enroll ${selectedStudents.length} Student${selectedStudents.length !== 1 ? 's' : ''}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EnrolledStudents