import { Router } from "express";
import { authenticateJWT } from "../utils/auth-middleware";
import { upload } from "../utils/upload";
import { deleteFileFromUrl, extractFilePath } from "../utils/file";
import prisma from "../utils/prisma";
import { deleteRecord } from "../utils/delete-request";

const router = Router();
const uploadMiddleware = upload("banner");

router.get("/", async (req, res) => {
   try {
      const banner = await prisma.banner.findMany({
         orderBy: { createdAt: "desc" },
         select: {
            id: true,
            image: true,
            alt: true,
            title: true,
            description: true,
         },
      });

      res.status(200).json({
         data: banner,
      });
   } catch (error) {
      res.status(500).json({ error: "An error occurred" });
   }
});

router.post(
   "/",
   authenticateJWT,
   uploadMiddleware.single("image"),
   async (req, res) => {
      const data = req.body;
      try {
         if (req.file) {
            const filePath = extractFilePath(req.file);
            const reqBody = {
               image: filePath,
               alt: data.alt,
               title: data.title,
               description: data.description,
            };
            const banner = await prisma.banner.create({
               data: reqBody,
            });
            res.status(200).json({ data: banner });
         }
      } catch (error) {
         res.status(500).json({ error: "An error occurred" });
      }
   }
);

router.put(
   "/",
   authenticateJWT,
   uploadMiddleware.single("image"),
   async (req, res) => {
      try {
         const data = req.body;
         const reqBody: { [key: string]: any } = {
            alt: data.alt,
            title: data.title,
            description: data.description,
         };
        
         if (req.file) {
            //update without saving image
            reqBody["image"] = extractFilePath(req.file);
            const banner = await prisma.banner.findUnique({
               where: { id: data.id },
            });
            deleteFileFromUrl(banner?.image as string);
         }

         // console.log(validated.value);
         const service = await prisma.banner.update({
            where: { id: data.id },
            data: reqBody,
         });
         res.status(200).json({ data: service });
      } catch (error) {
         console.log(error);
      }
   }
);

router.delete("/", authenticateJWT, async (req, res) => {
   deleteRecord(req, res, "banner");
});

export default router;
