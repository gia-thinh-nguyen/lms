// app/test-all/page.tsx
export const runtime = 'nodejs';
export const revalidate = 0;

import { revalidatePath } from 'next/cache';
import { connectDB } from '../../utils/mongodb';

import Student from '../../models/student.model';
import Course from '../../models/course.model';
import CourseEnrollment from '../../models/courseenrollment.model';
import Classroom from '../../models/classroom.model';
import Lesson from '../../models/lesson.model';
import Assignment from '../../models/assignment.model';

async function getSnapshot() {
  await connectDB();
  const [students, courses, enrollments, classrooms, lessons, assignments] = await Promise.all([
    Student.countDocuments(),
    Course.countDocuments(),
    CourseEnrollment.countDocuments(),
    Classroom.countDocuments(),
    Lesson.countDocuments(),
    Assignment.countDocuments(),
  ]);
  const latestStudent = await Student.findOne()
    .sort({ createdAt: -1 })
    .populate('enrolledCourses')
    .lean();

  return {
    counts: { students, courses, enrollments, classrooms, lessons, assignments },
    latestStudent: latestStudent
      ? {
          studentId: (latestStudent as any).studentId,
          email: (latestStudent as any).email,
          credits: (latestStudent as any).credits ?? 0,
          enrolledCourses: ((latestStudent as any).enrolledCourses ?? []).map((c: any) =>
            c && c.courseId ? { courseId: c.courseId, title: c.title } : c
          ),
        }
      : null,
  };
}

export default async function TestAllPage() {
  const data = await getSnapshot();

  // 1) Seed Student
  async function seedStudent(_f: FormData) {
    'use server';
    await connectDB();
    const suffix = Date.now().toString().slice(-5);
    await Student.create({
      studentId: `S${suffix}`,
      title: 'Mr',
      firstName: 'Alex',
      lastName: 'Ng',
      email: `alex${suffix}@example.com`,
      status: 'active',
      credits: 0,
    });
    revalidatePath('/test-all');
  }

  // 2) Seed Course + link to latest Student + CourseEnrollment
  async function seedCourse(_f: FormData) {
    'use server';
    await connectDB();
    const suffix = Date.now().toString().slice(-5);
    const course = await Course.create({
      courseId: `BCOM-${suffix}`,
      title: `Business ${suffix}`,
      status: 'active',
      totalCreditsRequired: 24,
    });

    const student = await Student.findOne().sort({ createdAt: -1 });
    if (student) {
      student.enrolledCourses.push(course._id);
      await student.save();
      await CourseEnrollment.create({
        studentId: student._id,
        courseId: course._id,
        status: 'in-progress',
        creditsEarned: 0,
      });
    }
    revalidatePath('/test-all');
  }

  // 3) Seed Lesson + 2 Assignments (+ prereq if one exists)
  async function seedLessonAndAssignments(_f: FormData) {
    'use server';
    await connectDB();
    const suffix = Date.now().toString().slice(-5);

    const a1 = await Assignment.create({ name: `Essay ${suffix}`, grade: '' });
    const a2 = await Assignment.create({ name: `Quiz ${suffix}`, grade: '' });
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

    const course = await Course.findOne().sort({ createdAt: -1 });
    if (course) {
      (course as any).lessonIds = (course as any).lessonIds || [];
      (course as any).lessonIds.push(lesson._id);
      await course.save();
    }
    revalidatePath('/test-all');
  }

  // 4) Seed Classrooms for latest student/course and the 2 latest lessons
  async function seedClassrooms(_f: FormData) {
    'use server';
    await connectDB();

    const student = await Student.findOne().sort({ createdAt: -1 });
    const course = await Course.findOne().sort({ createdAt: -1 });
    const lessons = await Lesson.find().sort({ createdAt: -1 }).limit(2);

    if (student && course && lessons.length) {
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
    }
    revalidatePath('/test-all');
  }

  // 5) Complete one in-progress lesson and award +6 credits
  async function completeOneLesson(_f: FormData) {
    'use server';
    await connectDB();
    const student = await Student.findOne().sort({ createdAt: -1 });
    if (!student) return;
    const row = await Classroom.findOne({ studentId: student._id, status: 'in-progress' }).sort({ createdAt: 1 });
    if (!row) return;
    row.status = 'completed';
    await row.save();
    student.credits = (student.credits ?? 0) + 6;
    await student.save();
    revalidatePath('/test-all');
  }

  // UI
  return (
    <main
      style={{
        padding: 24,
        fontFamily: 'ui-sans-serif, system-ui',
        backgroundColor: '#ffffff',
        color: '#000000',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ fontWeight: 700, marginBottom: 8 }}>Test all models</h1>

      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          marginTop: 12,
        }}
      >
        <form action={seedStudent}><button type="submit" style={btn}>➕ Seed Student</button></form>
        <form action={seedCourse}><button type="submit" style={btn}>➕ Seed Course & Link</button></form>
        <form action={seedLessonAndAssignments}><button type="submit" style={btn}>➕ Seed Lesson + Assignments</button></form>
        <form action={seedClassrooms}><button type="submit" style={btn}>➕ Seed Classrooms</button></form>
        <form action={completeOneLesson}><button type="submit" style={btn}>✅ Complete 1 lesson (+6 credits)</button></form>
      </div>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontWeight: 600, marginBottom: 8 }}>Counts</h2>
        <pre style={pre}>{JSON.stringify(data.counts, null, 2)}</pre>
      </section>

      <section style={{ marginTop: 12 }}>
        <h2 style={{ fontWeight: 600, marginBottom: 8 }}>Latest Student (populated courses)</h2>
        <pre style={pre}>{JSON.stringify(data.latestStudent, null, 2)}</pre>
      </section>

      <p style={{ marginTop: 8, color: '#111111' }}>
        Suggested order: Student → Course → Lesson → Classrooms. Then “Complete 1 lesson” to see credits increase.
      </p>
    </main>
  );
}

const btn: React.CSSProperties = {
  padding: 10,
  border: '1px solid #ccc',
  borderRadius: 8,
  width: '100%',
  textAlign: 'left',
  backgroundColor: '#ffffff',
  color: '#000000',
};

const pre: React.CSSProperties = {
  background: '#f7f7f7',
  color: '#000000',
  padding: 12,
  borderRadius: 8,
  whiteSpace: 'pre-wrap',
  border: '1px solid #e5e7eb',
};
