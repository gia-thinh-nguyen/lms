// scripts/check-student.ts
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // Load env for CLI

import { Types } from 'mongoose';
import { connectDB } from '../utils/mongodb.ts';

import Student from '../models/Student.ts';
import Course from '../models/Course.ts';
import CourseEnrollment from '../models/CourseEnrollment.ts';
import Classroom from '../models/Classroom.ts';
import Lesson from '../models/Lesson.ts';
import Assignment from '../models/Assignment.ts';

// ---------- Lean types (so TS knows shapes after .lean()) ----------
type CourseLean = {
  _id: Types.ObjectId;
  courseId: string;
  title: string;
  lessonIds?: Types.ObjectId[];
};

type StudentLean = {
  _id: Types.ObjectId;
  studentId: string;
  email: string;
  credits?: number;
  enrolledCourses?: (CourseLean | Types.ObjectId)[];
};

type LessonLean = {
  _id: Types.ObjectId;
  unitCode: string;
  status: 'draft' | 'published' | 'archived';
  credit?: number;
  assignments?: (Types.ObjectId | { _id: Types.ObjectId; name: string; grade?: 'Pass' | 'Fail' | '' })[];
};

// --------------------------------------------------------------------

async function run() {
  console.log('Env present?', !!process.env.MONGODB_URI);
  await connectDB();

  // 1) Counts for all collections
  const [students, courses, enrollments, classrooms, lessons, assignments] = await Promise.all([
    Student.countDocuments(),
    Course.countDocuments(),
    CourseEnrollment.countDocuments(),
    Classroom.countDocuments(),
    Lesson.countDocuments(),
    Assignment.countDocuments(),
  ]);

  console.log('\n✅ Counts snapshot:');
  console.log('   Students           :', students);
  console.log('   Courses            :', courses);
  console.log('   CourseEnrollments  :', enrollments);
  console.log('   Classrooms         :', classrooms);
  console.log('   Lessons            :', lessons);
  console.log('   Assignments        :', assignments);

  // 2) Latest Student (populated courses)
  const latestStudent = await Student.findOne()
    .sort({ createdAt: -1 })
    .populate('enrolledCourses')
    .lean<StudentLean | null>();

  if (latestStudent) {
    const enrolled = (latestStudent.enrolledCourses ?? []).map((c) =>
      typeof c === 'object' && c && '_id' in c ? (c as CourseLean).courseId : String(c)
    );

    console.log('\n👤 Latest student:');
    console.log('   studentId :', latestStudent.studentId);
    console.log('   email     :', latestStudent.email);
    console.log('   credits   :', latestStudent.credits ?? 0);
    console.log('   courses   :', enrolled.length ? enrolled.join(', ') : '(none)');
  } else {
    console.log('\n👤 No students found yet.');
  }

  // 3) Latest Course
  const latestCourse = await Course.findOne()
    .sort({ createdAt: -1 })
    .lean<{ _id: Types.ObjectId; courseId: string; title: string; lessonIds?: Types.ObjectId[] } | null>();

  if (latestCourse) {
    console.log('\n📘 Latest course:');
    console.log('   courseId  :', latestCourse.courseId);
    console.log('   title     :', latestCourse.title);
    console.log('   lessons[] :', (latestCourse.lessonIds ?? []).length);
  } else {
    console.log('\n📘 No courses found yet.');
  }

  // 4) Latest Lesson
  const latestLesson = await Lesson.findOne()
    .sort({ createdAt: -1 })
    .lean<LessonLean | null>();

  if (latestLesson) {
    const aCount = (latestLesson.assignments ?? []).length;
    console.log('\n📒 Latest lesson:');
    console.log('   unitCode  :', latestLesson.unitCode);
    console.log('   status    :', latestLesson.status);
    console.log('   credit    :', latestLesson.credit ?? 0);
    console.log('   assignments:', aCount);
  } else {
    console.log('\n📒 No lessons found yet.');
  }

  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
