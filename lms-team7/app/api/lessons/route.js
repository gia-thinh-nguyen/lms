import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/connectDB';
import Lesson from '@/models/lessons';
import User from '@/models/user';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope');        // 'mine' | 'all'
    const designerEmail = searchParams.get('email');

    const q = {};
    if (scope === 'mine' && designerEmail) {
      const designer = await User.findOne({ email: designerEmail, role: 'teacher' });
      if (!designer) return NextResponse.json({ lessons: [] });
      q.designerId = designer._id;
    }

    const lessons = await Lesson.find(q).lean();
    return NextResponse.json({ lessons });
  } catch (e) {
    return NextResponse.json({ message: 'Internal server error', error: String(e) }, { status: 500 });
  }
}
