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
