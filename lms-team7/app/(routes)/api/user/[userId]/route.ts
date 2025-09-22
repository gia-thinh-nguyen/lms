import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '../../../../../db/connectMongoDB';
import User from '../../../../../models/user';
import Course from '../../../../../models/course';

// Ensure models are registered
User;
Course;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Validate required parameter
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectMongoDB();

    // Find the user by clerkId and populate enrolled courses
    const user = await User.findOne({ clerkId: userId })
      .populate({
        path: 'enrolledCourseIds',
        select: 'courseId title description credits status courseDirectorId',
        populate: {
          path: 'courseDirectorId',
          select: 'name email'
        }
      });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        clerkId: user.clerkId,
        name: user.name,
        email: user.email,
        dateEnrolled: user.dateEnrolled,
        status: user.status,
        currentCreditPoints: user.currentCreditPoints,
        enrolledCourses: user.enrolledCourseIds || []
      },
      message: 'User data retrieved successfully'
    });

  } catch (error: any) {
    console.error('Error fetching user:', error);
    
    // Handle specific mongoose errors
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}