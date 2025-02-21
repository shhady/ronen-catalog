import mongoose from 'mongoose';
import Brand from './Brand';
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  // stock: { type: Number, default: 0 },
  // price: { type: Number, required: false },
  country: { type: String },
  imageUrl: { type: String }, // Cloudinary URL
  units: { type: String },
  weight: { type: String },
  weightUnit: { type: String },
  barCode: { type: String },
  // status: { type: String, enum: ['active', 'draft', 'out_of_stock', 'hidden'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.models?.Product || mongoose.model('Product', ProductSchema);
export default Product; 