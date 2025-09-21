"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const dummyLesson = {
  id: "L101",
  title: "Introduction to Programming",
  students: [
    { id: 1, name: "Student One", grades: [80, 90] },
    { id: 2, name: "Student Two", grades: [70, 85] },
  ],
  assignments: ["Assignment 1", "Assignment 2"],
};

export default function LessonDetailsPage() {
  const router = useRouter();
  const [view, setView] = useState("main");

  // Calculate average grade for each student
  const getAverage = (grades) =>
    grades.length ? Math.round(grades.reduce((a, b) => a + b, 0) / grades.length) : "N/A";

  return (
    <div className="p-8" style={{ marginLeft: '4rem' }}>
      <h1 className="text-2xl font-bold text-green-700 mb-6">{dummyLesson.title}</h1>
      <div className="flex gap-4 mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setView("students")}
        >
          Students
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setView("assignments")}
        >
          Assignments
        </button>
      </div>
      {view === "students" && (
        <div>
          <h2 className="text-lg font-bold mb-4">Students & Average Grades</h2>
          <ul>
            {dummyLesson.students.map((student) => (
              <li key={student.id} className="mb-2">
                {student.name} — Average Grade: {getAverage(student.grades)}
              </li>
            ))}
          </ul>
        </div>
      )}
      {view === "assignments" && (
        <div>
          <h2 className="text-lg font-bold mb-4">Assignments</h2>
          <ul>
            {dummyLesson.assignments.map((assignment, idx) => (
              <li key={idx} className="mb-2">
                {assignment}
                {/* Add edit/delete buttons here as needed */}
              </li>
            ))}
          </ul>
          {/* Add form/buttons to create/edit/delete assignments as needed */}
        </div>
      )}
    </div>
  );
}