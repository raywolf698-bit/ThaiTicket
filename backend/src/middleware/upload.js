const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const CloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'thai-lottery-tickets',
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  transformation: [{ width: 800, height: 600, crop: 'limit' }],
});

const upload = multer({ storage });

module.exports = upload;