import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/connectDB';
import Course from '@/models/course';
import User from '@/models/user';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') || 'all';
    const q = {};
    if (scope === 'active') q.status = 'active';
    if (scope === 'inactive') q.status = 'inactive';

    const courses = await Course.find(q)
      .populate('directorId', 'firstName lastName email')
      .populate('lessons', 'unitCode title credit status')
      .lean();

    return NextResponse.json({ courses });
  } catch (e) {
    return NextResponse.json({ message: 'Internal server error', error: String(e) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { title, courseId, directorEmail, description, status = 'active' } = await request.json();

    const exists = await Course.findOne({ courseId });
    if (exists) return NextResponse.json({ message: 'Course ID already exists' }, { status: 400 });

    let directorId;
    if (directorEmail) {
      const director = await User.findOne({ email: directorEmail, role: 'teacher' });
      if (!director) return NextResponse.json({ message: 'Director not found' }, { status: 400 });
      directorId = director._id;
    }

    const course = await Course.create({
      title,
      courseId,
      directorId,
      description: description || '',
      status,
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: 'Internal server error', error: String(e) }, { status: 500 });
  }
}
