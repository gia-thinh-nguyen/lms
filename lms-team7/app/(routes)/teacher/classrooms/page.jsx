"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function ClassroomLessons() {
  const [lessons, setLessons] = useState([
    {
      id: "L101",
      title: "Introduction to Programming",
      description: "Learn the basics of programming.",
      credit: 6,
      students: [
        { id: 1, name: "Student One", grades: [80, 90] },
        { id: 2, name: "Student Two", grades: [70, 85] },
      ],
      assignments: ["Assignment 1", "Assignment 2"],
    },
  ]);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [newLesson, setNewLesson] = useState({
    id: "",
    title: "",
    description: "",
    credit: "",
    students: [],
    assignments: [],
  });

  // Create lesson handler
  const handleCreateLesson = () => {
    if (!newLesson.id || !newLesson.title) return;
    setLessons([...lessons, { ...newLesson, credit: Number(newLesson.credit) }]);
    setShowCreate(false);
    setNewLesson({ id: "", title: "", description: "", credit: "", students: [], assignments: [] });
  };

  // Edit lesson handler
  const handleEditLesson = (idx) => {
    setEditIdx(idx);
    setNewLesson({ ...lessons[idx], credit: lessons[idx].credit.toString() });
    setShowEdit(true);
  };

  // Save edited lesson
  const handleSaveEditLesson = () => {
    const updated = [...lessons];
    updated[editIdx] = { ...newLesson, credit: Number(newLesson.credit) };
    setLessons(updated);
    setShowEdit(false);
    setEditIdx(null);
    setNewLesson({ id: "", title: "", description: "", credit: "", students: [], assignments: [] });
  };

  // Delete lesson handler
  const handleDeleteLesson = (idx) => {
    setLessons(lessons.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-8" style={{ marginLeft: '4rem' }}>
      <h1 className="text-2xl font-bold text-green-700 mb-6">Lesson Management</h1>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-6"
        onClick={() => setShowCreate(true)}
      >
        Create New Lesson
      </button>
      {/* Create Lesson Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Create Lesson</h2>
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Lesson ID"
              value={newLesson.id}
              onChange={e => setNewLesson({ ...newLesson, id: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Lesson Title"
              value={newLesson.title}
              onChange={e => setNewLesson({ ...newLesson, title: e.target.value })}
            />
            <textarea
              className="border p-2 mb-2 w-full"
              placeholder="Lesson Description"
              value={newLesson.description}
              onChange={e => setNewLesson({ ...newLesson, description: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Credit Points"
              type="number"
              value={newLesson.credit}
              onChange={e => setNewLesson({ ...newLesson, credit: e.target.value })}
            />
            <div className="flex gap-2 mt-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleCreateLesson}>Create</button>
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Lesson Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit Lesson</h2>
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Lesson ID"
              value={newLesson.id}
              onChange={e => setNewLesson({ ...newLesson, id: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Lesson Title"
              value={newLesson.title}
              onChange={e => setNewLesson({ ...newLesson, title: e.target.value })}
            />
            <textarea
              className="border p-2 mb-2 w-full"
              placeholder="Lesson Description"
              value={newLesson.description}
              onChange={e => setNewLesson({ ...newLesson, description: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Credit Points"
              type="number"
              value={newLesson.credit}
              onChange={e => setNewLesson({ ...newLesson, credit: e.target.value })}
            />
            <div className="flex gap-2 mt-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSaveEditLesson}>Save</button>
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowEdit(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {lessons.map((lesson, idx) => (
          <div key={lesson.id} className="bg-white shadow-lg rounded-lg p-6 mb-4">
            <h2 className="text-xl font-bold text-green-700 mb-2">
              <Link href={`/teacher/classrooms/${lesson.id}`}>
                {lesson.title}
              </Link>
            </h2>
            <div className="text-gray-600">ID: {lesson.id}</div>
            <div className="text-gray-600">Description: {lesson.description}</div>
            <div className="text-gray-600">Credit Points: {lesson.credit}</div>
            <div className="text-gray-600">Students: {lesson.students.length}</div>
            <div className="text-gray-600">Assignments: {lesson.assignments.length}</div>
            <div className="flex gap-2 mt-4">
              <button className="bg-yellow-500 text-white px-2 py-1 rounded text-xs" onClick={() => handleEditLesson(idx)}>Edit</button>
              <button className="bg-red-500 text-white px-2 py-1 rounded text-xs" onClick={() => handleDeleteLesson(idx)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}