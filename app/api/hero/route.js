import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Hero from '@/models/Hero';

export async function GET() {
  try {
    await connectDB();
    const hero = await Hero.findOne().sort({ createdAt: -1 });
    return NextResponse.json(hero || {});
  } catch (error) {
    console.error('Error fetching hero:', error);
    return NextResponse.json(
      { error: 'Error fetching hero image' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    await connectDB();

    // Find the existing hero or create a new one if none exists
    const existingHero = await Hero.findOne();
    
    if (existingHero) {
      // Update existing hero
      existingHero.imageUrl = data.imageUrl;
      await existingHero.save();
      return NextResponse.json(existingHero);
    } else {
      // Create new hero if none exists
      const hero = new Hero({
        imageUrl: data.imageUrl,
      });
      await hero.save();
      return NextResponse.json(hero);
    }
  } catch (error) {
    console.error('Error updating hero:', error);
    return NextResponse.json(
      { error: 'Error updating hero image' },
      { status: 500 }
    );
  }
} 