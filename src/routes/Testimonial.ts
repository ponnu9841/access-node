import { Router } from "express";
import { authenticateJWT } from "../utils/auth-middleware";
import { upload } from "../utils/upload";
import { deleteFileFromUrl, extractFilePath } from "../utils/file";
import prisma from "../utils/prisma";
// import {
//    validateServicePostRequest,
//    validateServicePutRequest,
// } from "../validation/service";
import { deleteRecord } from "../utils/delete-request";
import { errorHandler } from "../utils/error-handler";

const router = Router();
const uploadMiddleware = upload("testimonial");

router.get("/", async (req, res) => {
   try {
      const testimonials = await prisma.testimonial.findMany({
         orderBy: { createdAt: "desc" },
         select: {
            id: true,
            name: true,
            image: true,
            alt: true,
            vido_url: true,
            designation: true,
            testimonial: true,
         },
      });
      res.status(200).json({
         data: testimonials,
      });
   } catch (error) {
      errorHandler(error as Error, req, res);
   }
});

router.post(
   "/",
   authenticateJWT,
   uploadMiddleware.single("image"),
   async (req, res) => {
      try {
         const filePath = req.file && extractFilePath(req.file);
         const data = req.body;
         const reqBody: {
            name: string;
            alt: string;
            designation: string;
            testimonial: string;
            image?: string;
            vido_url?: string;
         } = {
            name: data.name,
            alt: data.alt || "",
            designation: data.designation || "",
            testimonial: data.testimonial,
            image: filePath || "",
            vido_url: data.url || ""
         };
         const testimonial = await prisma.testimonial.create({
            data: reqBody,
         });

         res.status(200).json({ data: testimonial });
      } catch (error) {
         errorHandler(error as Error, req, res);
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
         const reqBody: ReqBody = {
            name: data.name,
            alt: data.alt || "",
            designation: data.designation || "",
            testimonial: data.testimonial,
         };
         // const validated = validateServicePutRequest({
         //    ...reqBody,
         //    id: data.id,
         // });

         if (req.file) {
            //update without saving image
            reqBody["image"] = extractFilePath(req.file);
            const testimonial = await prisma.testimonial.findUnique({
               where: { id: data.id },
            });
            deleteFileFromUrl(testimonial?.image as string);
         }

         // console.log(validated.value);
         const testimonial = await prisma.testimonial.update({
            where: { id: data.id },
            data: reqBody,
         });
         res.status(200).json({ data: testimonial });
      } catch (error) {
         errorHandler(error as Error, req, res);
      }
   }
);

router.delete("/", authenticateJWT, async (req, res) => {
   deleteRecord(req, res, "testimonial", false);
});

export default router;
