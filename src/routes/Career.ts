import { Router } from "express";
import { authenticateJWT } from "../utils/auth-middleware";
import prisma from "../utils/prisma";
import { deleteRecord } from "../utils/delete-request";
import { errorHandler } from "../utils/error-handler";
import { upload } from "../utils/upload";
import { deleteFileFromUrl, extractFilePath } from "../utils/file";

const router = Router();
const uploadMiddleware = upload("career");

router.get("/", async (req, res) => {
   try {
      const contact = await prisma.career.findFirst();
      res.status(200).json({ data: contact });
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
               title: data.title,
               image: filePath,
               alt: data.alt,
               description: data.description,
               url: data.url,
               button_title: data.buttonTitle,
            };
            const career = await prisma.career.create({
               data: reqBody,
            });
            res.status(200).json({ data: career });
         }
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
            title: data.title,
            alt: data.alt,
            description: data.description,
            url: data.url,
            button_title: data.buttonTitle,
          };
 
          if (req.file) {
             //update without saving image
             reqBody["image"] = extractFilePath(req.file);
             const banner = await prisma.career.findUnique({
                where: { id: data.id },
             });
             deleteFileFromUrl(banner?.image as string);
          }
 
          const career = await prisma.career.update({
             where: { id: data.id },
             data: reqBody,
          });
          res.status(200).json({ data: career });
       } catch (error) {
          errorHandler(error as Error, req, res);
       }
    }
 );

router.delete("/", authenticateJWT, async (req, res) => {
   deleteRecord(req, res, "career", false);
});

export default router;
