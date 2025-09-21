'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'

const CoursePage = () => {
  const params = useParams()
  const courseId = params.courseId

  // This would typically fetch course data based on courseId
  // For now, using dummy data for demonstration
  const dummyTeachers = [
    { id: 1, name: "Aadi Kapoor" },
    { id: 2, name: "Ankit Kakanoor" },
    { id: 3, name: "Tim Nguyen" },
    { id: 4, name: "Saketh Vinukonda" },
  ]

  const dummyCourses = [
    {
      id: "CS101",
      title: "Intro to Computer Science",
      credits: 3,
      status: "active",
      director: dummyTeachers[0],
      lessons: ["Lesson 1", "Lesson 2"],
      description: "An introduction to fundamental concepts in computer science including algorithms, data structures, and programming principles."
    },
    {
      id: "MATH201",
      title: "Calculus I",
      credits: 4,
      status: "inactive",
      director: dummyTeachers[1],
      lessons: ["Limits", "Derivatives"],
      description: "First semester calculus covering limits, derivatives, and their applications."
    },
    {
      id: "PHY301",
      title: "Physics for Engineers",
      credits: 3,
      status: "active",
      director: dummyTeachers[2],
      lessons: ["Mechanics", "Thermodynamics", "Electromagnetism"],
      description: "Physics principles applied to engineering problems and applications."
    },
    {
      id: "ENG102",
      title: "English Composition",
      credits: 2,
      status: "active",
      director: dummyTeachers[3],
      lessons: ["Grammar", "Essay Writing", "Research Methods"],
      description: "Development of writing skills through composition and critical analysis."
    }
  ]

  const course = dummyCourses.find(c => c.id === courseId)

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
            <p className="text-gray-600 mb-4">{course.description}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="btn btn-primary">Edit Course</button>
            <button className="btn btn-outline">View Analytics</button>
          </div>
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Course ID</div>
            <div className="stat-value text-2xl">{course.id}</div>
          </div>
          
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Credits</div>
            <div className="stat-value text-2xl">{course.credits}</div>
          </div>
          
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Total Lessons</div>
            <div className="stat-value text-2xl">{course.lessons.length}</div>
          </div>
        </div>
      </div>

      {/* Course Director */}
      <div className="bg-base-100 rounded-lg shadow-xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Course Director</h2>
        <div className="flex items-center gap-4">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-12">
              <span className="text-xl">{course.director.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">{course.director.name}</h3>
            <p className="text-gray-600">Course Director</p>
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div className="bg-base-100 rounded-lg shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Course Lessons</h2>
          <button className="btn btn-sm btn-primary">Add Lesson</button>
        </div>
        
        <div className="space-y-3">
          {course.lessons.map((lesson, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="badge badge-outline">{index + 1}</div>
                <span className="font-medium">{lesson}</span>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm btn-ghost">Edit</button>
                <button className="btn btn-sm btn-primary">View</button>
              </div>
            </div>
          ))}
        </div>
        
        {course.lessons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No lessons available for this course yet.
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursePage