import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/connectDB';
import Classroom from '@/models/classroom';
import User from '@/models/user';
import Course from '@/models/course';
import Lesson from '@/models/lesson';

export async function POST(request) {
  try {
    await connectDB();
    const { teacherEmail, studentEmail, courseId, unitCode, startDate, durationWeeks, grade } = await request.json();

    const teacher = await User.findOne({ email: teacherEmail, role: 'teacher' });
    const student = await User.findOne({ email: studentEmail, role: 'student' });
    const course  = await Course.findOne({ courseId });
    const lesson  = await Lesson.findOne({ unitCode });

    if (!teacher || !student || !course || !lesson) {
      return NextResponse.json({ message: 'Invalid teacher/student/course/lesson' }, { status: 400 });
    }

    const row = await Classroom.findOneAndUpdate(
      { courseRef: course._id, lessonRef: lesson._id, studentRef: student._id },
      { teacherRef: teacher._id, startDate, durationWeeks, grade: grade || 'IP' },
      { upsert: true, new: true }
    );

    return NextResponse.json({ classroom: row }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error: String(error) }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const { id, grade, durationWeeks } = await request.json();
    const updated = await Classroom.findByIdAndUpdate(
      id,
      { ...(grade && { grade }), ...(durationWeeks && { durationWeeks }) },
      { new: true }
    );
    if (!updated) return NextResponse.json({ message: 'Row not found' }, { status: 404 });
    return NextResponse.json({ classroom: updated });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error: String(error) }, { status: 500 });
  }
}
