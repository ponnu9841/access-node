import multer from "multer";
import path from "path";
import fs from "fs";
import { randomBytes } from "crypto";

// Allowed image file types
const allowedImageTypes = [
   "image/jpeg",
   "image/jpg",
   "image/png",
   "image/gif",
   "image/webp",
];

// Function to create upload middleware dynamically
export const upload = (folderName: string) => {
   return multer({
      storage: multer.diskStorage({
         destination: (req, file, cb) => {
            const uploadDir = path.join(
               __dirname,
               `../../public/uploads/${folderName}/`
            );

            // Ensure the upload directory exists
            fs.mkdirSync(uploadDir, { recursive: true });

            cb(null, uploadDir);
         },
         filename: (req, file, cb) => {
            cb(
               null,
               file.fieldname +
                  "-" +
                  randomBytes(16).toString("hex") +
                  Date.now() +
                  path.extname(file.originalname)
            );
         },
      }),
      fileFilter: (req, file, cb) => {
         if (!allowedImageTypes.includes(file.mimetype)) {
            return cb(
               new Error("Only images (jpeg, jpg, png, gif, webp) are allowed")
            );
         }
         cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 5MB file size limit
   });
};
