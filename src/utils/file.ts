export const extractFilePath = (file: Express.Multer.File): string => {
   if (!file || !file.path) {
      throw new Error("Invalid file object");
   }

   // Replace backslashes (Windows) with forward slashes
   const normalizedPath = file.path.replace(/\\/g, "/");

   // Extract the path after "public"
   const relativePath = normalizedPath.split("/public").pop();

   return `${process.env.BASE_URL}${relativePath}`;
};

import fs from "fs";
import path from "path";

export const deleteFileFromUrl = (fileUrl: string): void => {
   try {
      if (!fileUrl) {
         throw new Error("Invalid file URL");
      }

      // Extract the path after BASE_URL (e.g., "/uploads/banner/image-xxxx.jpg")
      const relativePath = fileUrl.replace(process.env.BASE_URL || "", "");

      // Convert to absolute path on the server
      const absolutePath = path.join(__dirname, `../../public${relativePath}`);

      // Check if file exists before deleting
      if (fs.existsSync(absolutePath)) {
         fs.unlinkSync(absolutePath); // Delete the file
         console.log(`Deleted file: ${absolutePath}`);
      } else {
         console.warn(`File not found: ${absolutePath}`);
      }
   } catch (error) {
      if (error instanceof Error) {
         console.error("Error deleting file:", error.message);
      } else {
         console.error("An unknown error occurred while deleting the file.");
      }
   }
};
