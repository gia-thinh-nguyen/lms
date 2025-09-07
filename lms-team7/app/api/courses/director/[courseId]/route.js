import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/connectDB';
import Course from '@/models/course';
import User from '@/models/user';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { courseId } = params;
    const { directorEmail } = await request.json();

    const director = await User.findOne({ email: directorEmail, role: 'teacher' });
    if (!director) return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });

    const updated = await Course.findOneAndUpdate(
      { courseId },
      { courseDirectorId: director._id },
      { new: true }
    );
    if (!updated) return NextResponse.json({ message: 'Course not found' }, { status: 404 });

    return NextResponse.json({ course: updated });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error: String(error) }, { status: 500 });
  }
}
