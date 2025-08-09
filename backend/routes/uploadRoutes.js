import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { protect } from '../middleware/authMiddleware.js';
import 'dotenv/config';

const router = express.Router();

// Configure Cloudinary with your credentials from the .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to handle file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @desc    Upload an image file
// @route   POST /api/upload
// @access  Private (requires user to be logged in)
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No image file provided.');
    }

    // Multer adds the file to the request object. We need to convert the buffer to a base64 string.
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'internsaathi_profiles', // Optional: organizes uploads into a folder in Cloudinary
    });

    // Send the secure URL of the uploaded image back to the frontend
    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: error.message || 'Server error during image upload.' });
  }
});

export default router;
