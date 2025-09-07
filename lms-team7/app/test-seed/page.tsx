// app/test-seed/page.tsx
export const runtime = 'nodejs';
export const revalidate = 0;

import { revalidatePath } from 'next/cache';
import { connectDB } from '../../utils/mongodb';

import Student from '../../models/Student';
import Course from '../../models/Course';
import CourseEnrollment from '../../models/CourseEnrollment';
import Classroom from '../../models/Classroom';
import Lesson from '../../models/Lesson';
import Assignment from '../../models/Assignment';

export default function TestSeedAllPage() {
  async function seedAll(_form: FormData) {
    'use server';
    await connectDB();

    // 1) Student
    const suffix = Date.now().toString().slice(-5);
    const student = await Student.create({
      studentId: `S${suffix}`,
      title: 'Mr',
      firstName: 'Alex',
      lastName: 'Ng',
      email: `alex${suffix}@example.com`,
      status: 'active',
      credits: 0,
    });

    // 2) Course
    const course = await Course.create({
      courseId: `BCOM-${suffix}`,
      title: `Business ${suffix}`,
      status: 'active',
      totalCreditsRequired: 24,
    });

    // link on student + CourseEnrollment row
    student.enrolledCourses.push(course._id);
    await student.save();
    await CourseEnrollment.create({
      studentId: student._id,
      courseId: course._id,
      status: 'in-progress',
      creditsEarned: 0,
    });

    // 3) Assignments
    const a1 = await Assignment.create({ name: `Essay ${suffix}`, grade: '' });
    const a2 = await Assignment.create({ name: `Quiz ${suffix}`, grade: '' });

    // 4) Lesson (+ prerequisite if exists)
    const lastLesson = await Lesson.findOne().sort({ createdAt: -1 });
    const lesson = await Lesson.create({
      unitCode: `FITL${suffix}`,
      title: `Lesson ${suffix}`,
      description: 'Intro lesson',
      objectives: ['Understand X', 'Apply Y'],
      readingList: [{ title: 'Doc 1', url: 'https://example.com' }],
      estimatedHoursPerWeek: 4,
      prerequisites: lastLesson ? [lastLesson._id] : [],
      status: 'draft',
      assignments: [a1._id, a2._id],
      credit: 6,
    });
    (course as any).lessonIds = (course as any).lessonIds || [];
    (course as any).lessonIds.push(lesson._id);
    await course.save();

    // 5) Classrooms (2 rows, same student+course, 2 latest lessons)
    const lessons = await Lesson.find().sort({ createdAt: -1 }).limit(2);
    for (const les of lessons) {
      await Classroom.create({
        studentId: student._id,
        courseId: course._id,
        lessonId: les._id,
        teacherId: 'T-001',
        startDate: new Date(),
        durationWeeks: 0,
        grade: '',
        status: 'in-progress',
      });
    }

    revalidatePath('/test-all');
  }

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Seed ALL models (one click)</h1>
      <form action={seedAll}>
        <button type="submit" style={{ padding: 10, border: '1px solid #ccc', borderRadius: 6 }}>
          Seed Student + Course (+Enrollment) + Lesson (+Assignments) + Classrooms
        </button>
      </form>
      <p style={{ marginTop: 12 }}>After seeding, open <code>/test-all</code> to see counts and relationships.</p>
    </main>
  );
}
