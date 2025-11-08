import multer from "multer";
import path from "path";

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save files inside the "uploads" folder at the backend root
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    // Use timestamp + sanitized original filename
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`);
  },
});

// Export the configured multer instance
export const upload = multer({ storage });
