import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Analytics from '@/models/Analytics';

export async function POST() {
  try {
    await connectDB();
    await Analytics.incrementStat('websiteViews');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.json(
      { message: 'אירעה שגיאה בשמירת הנתונים' },
      { status: 500 }
    );
  }
} 