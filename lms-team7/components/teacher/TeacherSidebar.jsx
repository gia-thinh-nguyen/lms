'use client'
import React, { useState } from "react";
import Link from "next/link";

import { FaHome, FaBook, FaChalkboardTeacher, FaPalette, FaBars, FaTimes } from "react-icons/fa";
import TeacherSidebarItem from "./TeacherSidebarItem";

export default function TeacherSidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transition-all duration-300 ${open ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <span className={`font-bold text-lg text-green-700 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>Teacher Panel</span>
        <button
          className="ml-auto p-2 rounded hover:bg-green-100 focus:outline-none"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close sidebar" : "Open sidebar"}
        >
          {open ? (
            <FaTimes className="h-6 w-6 text-green-700" />
          ) : (
            <FaBars className="h-6 w-6 text-green-700" />
          )}
        </button>
      </div>
      <nav className="flex flex-col gap-2 mt-6 px-2">
        {open && (
          <>
            <TeacherSidebarItem href="/teacher" icon={FaHome} label="Home" />
            <TeacherSidebarItem href="/teacher/courses" icon={FaBook} label="Courses" />
            <TeacherSidebarItem href="/teacher/classrooms" icon={FaChalkboardTeacher} label="Classroom" />
            <TeacherSidebarItem href="/teacher/theme" icon={FaPalette} label="Theme Selection" />
          </>
        )}
      </nav>
    </aside>
  );
}
