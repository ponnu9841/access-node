import { Router } from "express";
import { authenticateJWT } from "../utils/auth-middleware";
import { upload } from "../utils/upload";
import { deleteFileFromUrl, extractFilePath } from "../utils/file";
import prisma from "../utils/prisma";
import { deleteRecord } from "../utils/delete-request";
import { errorHandler } from "../utils/error-handler";

const router = Router();
const uploadMiddleware = upload("partner");

router.get("/", async (req, res) => {
   try {
      const partners = await prisma.partner.findMany({
         select: {
            id: true,
            image: true,
            alt: true,
         },
      });
      res.status(200).json({ data: partners });
   } catch (error) {
      errorHandler(error as Error, req, res);
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
            };
            const partner = await prisma.partner.create({
               data: reqBody,
            });
            res.status(200).json({ data: partner });
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
            alt: data.alt || "",
         };

         if (req.file) {
            //update without saving image
            reqBody["image"] = extractFilePath(req.file);
            const partner = await prisma.partner.findUnique({
               where: { id: data.id },
            });
            deleteFileFromUrl(partner?.image as string);
         }

         // console.log(validated.value);
         const partner = await prisma.partner.update({
            where: { id: data.id },
            data: reqBody,
         });
         res.status(200).json({ data: partner });
      } catch (error) {
         console.log(error);
      }
   }
);

router.delete("/", authenticateJWT, async (req, res) => {
   deleteRecord(req, res, "partner");
});

export default router;
