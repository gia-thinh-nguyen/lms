import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/connectDB';
import Enrollment from '@/models/enrollment';
import User from '@/models/user';
import Course from '@/models/course';

export async function POST(request) {
  try {
    await connectDB();
    const { studentEmail, courseId } = await request.json();

    const student = await User.findOne({ email: studentEmail, role: 'student' });
    if (!student) return NextResponse.json({ message: 'Student not found' }, { status: 404 });

    const course = await Course.findOne({ courseId });
    if (!course) return NextResponse.json({ message: 'Course not found' }, { status: 404 });

    const enr = await Enrollment.findOneAndUpdate(
      { studentId: student._id, courseId: course._id },
      { $setOnInsert: { startDate: new Date(), status: 'active' } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ enrollment: enr }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error: String(error) }, { status: 500 });
  }
}
