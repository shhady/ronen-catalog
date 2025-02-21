import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  whatsappClicks: { type: Number, default: 0 },
  websiteViews: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

// Add method to increment stats
AnalyticsSchema.statics.incrementStat = async function(stat) {
  const analytics = await this.findOne();
  if (!analytics) {
    return await this.create({ [stat]: 1 });
  }

  analytics[stat]++;
  return await analytics.save();
};

const Analytics = mongoose.models?.Analytics || mongoose.model('Analytics', AnalyticsSchema);
export default Analytics; 