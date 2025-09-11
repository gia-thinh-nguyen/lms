// app/(routes)/teacher/page.jsx
import { checkTeacher } from "@/utils/checkTeacher";
import OverviewCards from "@/components/OverviewCards";
import LessonForm from "@/components/LessonForm";
import CourseTable from "@/components/CourseTable";
import ClassroomTable from "@/components/ClassroomTable";

export default async function Page() {
  // If you don't have Clerk teacher role set up yet, temporarily force this to true for testing:
  // const isTeacher = true;
  const isTeacher = await checkTeacher();
  if (!isTeacher) {
    return null;
  }

  // ---------- MOCK DATA (UI ONLY) ----------
  const teacher = {
    name: "Dr. Taylor",
    coursesCount: 3,
    lessonsCount: 8,
    studentsCount: 54,
  };

  const courses = [
    {
      id: "CSE1001",
      title: "Intro to Computing",
      director: "Dr. Taylor",
      status: "Active",
      lessons: 4,
      enrolledStudents: 22,
      totalCredits: 24,
    },
    {
      id: "ENG2002",
      title: "Systems Engineering",
      director: "Prof. Diaz",
      status: "Active",
      lessons: 3,
      enrolledStudents: 18,
      totalCredits: 18,
    },
    {
      id: "MAT3003",
      title: "Applied Mathematics",
      director: "Dr. Taylor",
      status: "Inactive",
      lessons: 1,
      enrolledStudents: 14,
      totalCredits: 6,
    },
  ];

  const classrooms = [
    { _id: "1", course: "CSE1001 — Intro to Computing", lesson: "L1 — Variables", student: "Alex Johnson", teacher: "Dr. Taylor", startDate: "2025-08-05", durationWeeks: 12, grade: "HD" },
    { _id: "2", course: "CSE1001 — Intro to Computing", lesson: "L2 — Loops",     student: "Priya Singh",   teacher: "Dr. Taylor", startDate: "2025-08-05", durationWeeks: 12, grade: "D"  },
    { _id: "3", course: "ENG2002 — Systems Eng",        lesson: "L1 — Systems",   student: "Sam Wu",        teacher: "Prof. Diaz", startDate: "2025-08-06", durationWeeks: 12, grade: "C"  },
  ];
  // -----------------------------------------

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <p className="text-sm text-gray-600">Welcome back, {teacher.name}</p>
      </div>

      <OverviewCards
        courses={teacher.coursesCount}
        lessons={teacher.lessonsCount}
        students={teacher.studentsCount}
      />

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-semibold mb-3">Courses</h2>
        <CourseTable rows={courses} />
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-semibold mb-3">Create Lesson (UI only)</h2>
        <LessonForm />
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-semibold mb-3">Classroom</h2>
        <ClassroomTable rows={classrooms} />
      </div>
    </div>
  );
}
