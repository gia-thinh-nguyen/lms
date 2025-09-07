import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/connectDB';
import User from '@/models/user';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json(); // { firstName, lastName, email, role, staffId? }
    const newUser = await User.create(body);
    return NextResponse.json({ user: newUser, message: 'User created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error: String(error) }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role'); // 'student' | 'teacher'
    const q = role ? { role } : {};
    const users = await User.find(q).select('firstName lastName email role status').lean();
    return NextResponse.json({ users });
  } catch (e) {
    return NextResponse.json({ message: 'Internal server error', error: String(e) }, { status: 500 });
  }
}

