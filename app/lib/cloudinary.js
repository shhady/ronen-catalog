// import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export const uploadToCloudinary = async (file) => {
//   try {
//     const result = await cloudinary.uploader.upload(file, {
//       folder: 'ronen-catalog',
//       upload_preset: process.env.CLOUDINARY_PRESET_NAME,
//     });
//     return result.secure_url;
//   } catch (error) {
//     console.error('Error uploading to Cloudinary:', error);
//     throw new Error('Failed to upload image');
//   }
// };

// export default cloudinary; 