import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/connectDB';
import Lesson from '@/models/lesson';
import User from '@/models/user';

export async function POST(request) {
  try {
    await connectDB();
    const { unitCode, title, description, objectives, readingList, estHoursPerWeek, prereqs, designerEmail, credit } = await request.json();

    const teacher = await User.findOne({ email: designerEmail, role: 'teacher' });
    if (!teacher) return NextResponse.json({ message: 'Designer not found or not a teacher' }, { status: 400 });

    const lesson = await Lesson.create({
      unitCode, title,
      description: description || '',
      objectives: objectives || [],
      readingList: readingList || [],
      estHoursPerWeek: estHoursPerWeek || 6,
      prereqs: prereqs || [],
      designerId: teacher._id,
      status: 'active',
      credit: credit ?? 6,
    });

    return NextResponse.json({ lesson }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error: String(error) }, { status: 500 });
  }
}
