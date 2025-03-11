import { authenticateJWT } from "../utils/auth-middleware";
import { upload } from "../utils/upload";
import { deleteFileFromUrl, extractFilePath } from "../utils/file";
import prisma from "../utils/prisma";
// import {
//    validateServicePostRequest,
//    validateServicePutRequest,
// } from "../validation/service";
import { deleteRecord } from "../utils/delete-request";
import { Router } from "express";

const router = Router();

router.get("/", async (_, res) => {
   try {
      const about = await prisma.about.findFirst();
      res.status(200).json({
         data: about,
      });
   } catch (error) {
      console.log(error);
   }
});

router.post(
   "/",
   authenticateJWT,
   upload("about").fields([
      { name: "imageOne", maxCount: 1 },
      { name: "imageTwo", maxCount: 1 },
   ]),
   async (req, res) => {
      try {
         if (!req.files) {
            res.status(400).json({ error: "No file to upload" });
            return;
         }
         const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
         };

         const filePathOne = extractFilePath(files.imageOne[0]);
         const filePathTwo = extractFilePath(files.imageTwo[0]);

         if (filePathOne && filePathTwo) {
            const data = req.body;

            const reqBody = {
               title: data.title,
               sub_title: data.subTitle,
               image_one: filePathOne,
               image_two: filePathTwo,
               image_one_alt: data.imageOneAlt,
               image_two_alt: data.imageTwoAlt,
               short_description: data.shortDescription,
               long_description: data.longDescription,
            };
            const about = await prisma.about.create({
               data: reqBody,
            });

            res.status(200).json({ data: about });
         } else {
            res.status(404).json({ message: "Invalid Request" });
         }
      } catch (error) {
         console.log(error);
      }
   }
);

router.put(
   "/",
   authenticateJWT,
   upload("about").fields([
      { name: "imageOne", maxCount: 1 },
      { name: "imageTwo", maxCount: 1 },
   ]),
   async (req, res) => {
      try {
         const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
         };

         const filePathOne = extractFilePath(files.imageOne?.[0]);
         const filePathTwo = extractFilePath(files.imageTwo?.[0]);

         const data = req.body;

         const reqBody: ReqBody = {
            title: data.title,
            sub_title: data.subTitle || "",
            image_one_alt: data.imageOneAlt,
            image_two_alt: data.imageTwoAlt,
            short_description: data.shortDescription,
            long_description: data.longDescription || "",
         };

         if (filePathOne || filePathTwo) {
            const about = await prisma.about.findFirst();

            const updateImage = (
               filePath: string | undefined,
               key: "image_one" | "image_two"
            ) => {
               if (filePath) {
                  deleteFileFromUrl(about?.[key] as string);
                  reqBody[key] = filePath;
               }
            };

            updateImage(filePathOne, "image_one");
            updateImage(filePathTwo, "image_two");
         }

         const about = await prisma.about.update({
            where: { id: data.id },
            data: reqBody,
         });

         res.status(200).json({ data: about });
      } catch (error) {
         console.log(error);
      }
   }
);

export default router;
