import { Router } from "express";
import { authenticateJWT } from "../utils/auth-middleware";
import { upload } from "../utils/upload";
import { deleteFileFromUrl, extractFilePath } from "../utils/file";
import prisma from "../utils/prisma";
import { deleteRecord } from "../utils/delete-request";
import { errorHandler } from "../utils/error-handler";
import {
   createPaginatedResponse,
   getPaginationParams,
} from "../utils/pagination";

const router = Router();
const uploadMiddleware = upload("blog");

router.get("/", async (req, res) => {
   try {
      const { skip, take } = getPaginationParams(req);
      const page = parseInt(req.query.page as string) || 1;
      const limit = take;

      const gallery = await prisma.blog.findMany({
         skip,
         take,
         orderBy: { createdAt: "desc" },
      });
      // Get total count for pagination metadata
      const totalCount = await prisma.gallery.count();
      res.status(200).json(
         createPaginatedResponse(gallery, totalCount, page, limit)
      );
   } catch (error) {
      errorHandler(error as Error, req, res);
   }
});

router.get("/:id", async (req, res) => {
   try {
      const id = req.params.id;
      const blog = await prisma.blog.findFirst({
         where: { id: id },
      });
      res.status(200).json({
         data: blog,
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
         if (!req.file) {
            res.status(400).json({ error: "No file to upload" });
            return;
         }

         const filePath = extractFilePath(req.file);
         const data = req.body;
         const reqBody = {
            image: filePath,
            alt: data.imageAlt,
            title: data.title,
            content: data.content,
         };
         // const validated = validateServicePostRequest(reqBody);
         const service = await prisma.blog.create({
            data: reqBody,
         });

         res.status(200).json({ data: service });
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
            alt: data.imageAlt,
            title: data.title,
            content: data.content,
         };

         if (req.file) {
            reqBody["image"] = extractFilePath(req.file);
            const blog = await prisma.blog.findUnique({
               where: { id: data.id },
            });
            deleteFileFromUrl(blog?.image as string);
         }

         const blog = await prisma.blog.update({
            where: { id: data.id },
            data: reqBody,
         });
         res.status(200).json({ data: blog });
      } catch (error) {
         errorHandler(error as Error, req, res);
      }
   }
);

router.delete("/", authenticateJWT, async (req, res) => {
   deleteRecord(req, res, "blog");
});

export default router;
