import mongoose from 'mongoose';

const HeroSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Hero = mongoose.models?.Hero || mongoose.model('Hero', HeroSchema);
export default Hero; 