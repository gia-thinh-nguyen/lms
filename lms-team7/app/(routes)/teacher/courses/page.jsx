import React from 'react'
import Link from 'next/link'
import CourseCard from '@/components/teacher/CourseCard'

const page = () => {
  // Dummy data for demonstration
const dummyTeachers = [
  { id: 1, name: "Aadi Kapoor" },
  { id: 2, name: "Ankit Kakanoor" },
  { id: 3, name: "Tim Nguyen" },
  { id: 4, name: "Saketh Vinukonda" },
  { id: 5, name: "Kinglsey Wong" },
  { id: 6, name: "Maheshan Peiris" },
];

const dummyCourses = [
  {
    id: "CS101",
    title: "Intro to Computer Science",
    credits: 3,
    status: "active",
    director: dummyTeachers[0],
    lessons: ["Lesson 1", "Lesson 2"],
  },
  {
    id: "MATH201",
    title: "Calculus I",
    credits: 4,
    status: "inactive",
    director: dummyTeachers[1],
    lessons: ["Limits", "Derivatives"],
  },
  {
    id: "PHY301",
    title: "Physics for Engineers",
    credits: 3,
    status: "active",
    director: dummyTeachers[2],
    lessons: ["Mechanics", "Thermodynamics", "Electromagnetism"],
  },
  {
    id: "ENG102",
    title: "English Composition",
    credits: 2,
    status: "active",
    director: dummyTeachers[3],
    lessons: ["Grammar", "Essay Writing", "Research Methods"],
  },
];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">My Courses</h1>
          <p className="text-gray-600">Manage and view all your assigned courses</p>
        </div>
        <Link href="/teacher/courses/create" className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Course
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      
      {dummyCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No courses available</div>
          <p className="text-gray-400 mt-2">Contact your administrator to get assigned to courses</p>
        </div>
      )}
    </div>
  )
}

export default page