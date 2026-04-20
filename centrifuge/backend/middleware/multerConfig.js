
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure folder exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Allowed MIME types per field
const allowedTypes = {
  eventPoster: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg', 'image/ico', 'image/webp'],
  eventCategoryLogo: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
  // topicLogo: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
  images: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg', 'image/ico', 'image/webp'],
  videos: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm', 'video/3gpp', 'video/x-msvideo', 'video/x-matroska'],
  // pdfUrl: ['application/pdf'],
  thumbnail: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  backgroundTheme: ['image/gif', 'video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm', 'video/3gpp', 'video/x-msvideo', 'video/x-matroska' ]
};

// File filter to validate MIME types
const fileFilter = (req, file, cb) => {
  const types = allowedTypes[file.fieldname];
  if (types && types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}`), false);
  }
};

// Dynamic storage based on field name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/others';
    if (file.fieldname === 'videos') folder = 'uploads/videos';
    else if (file.fieldname === 'eventPoster' || file.fieldname === 'eventCategoryLogo' || file.fieldname === 'images') folder = 'uploads/images';
    else if (file.fieldname === 'thumbnail') folder = 'uploads/thumbnails';
    else if (file.fieldname === 'backgroundTheme') folder = 'uploads/backgroundTheme';
    
    const fullPath = path.join(process.cwd(), folder);
    ensureDir(fullPath);
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 6);
    const uniqueName = `${baseName}____${timestamp}_${randomString}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage, fileFilter });
module.exports = upload;
