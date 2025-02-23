import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true }, // Cloudinary URL
  description: { type: String, required: true },
  status: { type: String, default: 'shown' },
  createdAt: { type: Date, default: Date.now },
  longDescription: { type: String, required: true },
});

const Brand = mongoose.models?.Brand || mongoose.model('Brand', BrandSchema);
export default Brand; 