import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: 'משתמש עם כתובת דואר אלקטרוני זו כבר קיים' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'admin' // Default role as per our model
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json({ 
      message: 'המשתמש נוצר בהצלחה',
      user: userResponse 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'אירעה שגיאה בתהליך ההרשמה' },
      { status: 500 }
    );
  }
} 