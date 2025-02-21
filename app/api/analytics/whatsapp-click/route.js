import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Analytics from '@/models/Analytics';

// In a real application, you would store this in a database
let whatsappClicks = 0;

export async function POST() {
  try {
    await connectDB();
    await Analytics.incrementStat('whatsappClicks');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking WhatsApp click:', error);
    return NextResponse.json(
      { message: 'אירעה שגיאה בשמירת הנתונים' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const analytics = await Analytics.findOne() || { whatsappClicks: 0 };
    return NextResponse.json({ clicks: analytics.whatsappClicks });
  } catch (error) {
    console.error('Error getting WhatsApp clicks:', error);
    return NextResponse.json(
      { message: 'אירעה שגיאה בטעינת הנתונים' },
      { status: 500 }
    );
  }
} 