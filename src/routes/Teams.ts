import { Router } from "express";
import { authenticateJWT } from "../utils/auth-middleware";
import { upload } from "../utils/upload";
import { deleteFileFromUrl, extractFilePath } from "../utils/file";
import prisma from "../utils/prisma";
import { deleteRecord } from "../utils/delete-request";
import { errorHandler } from "../utils/error-handler";

const router = Router();
const uploadMiddleware = upload("teams");

router.get("/", async (req, res) => {
   try {
      const teams = await prisma.team.findMany({
         select: {
            id: true,
            name: true,
            image: true,
            alt: true,
            designation: true,
            linkedin_profile: true,
         },
      });
      res.status(200).json({ data: teams });
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
         if (!req.file) {
            res.status(400).json({ error: "No file to upload" });
            return;
         }
         const filePath = extractFilePath(req.file);
         const reqBody = {
            name: data.name,
            image: filePath,
            alt: data.alt,
            designation: data.designation,
            linkedin_profile: data.lindedInProfile,
         };
         const partner = await prisma.team.create({
            data: reqBody,
         });
         res.status(200).json({ data: partner });
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
         const reqBody: { [key: string]: any } = {
            name: data.name,
            alt: data.alt || "",
            designation: data.designation || "",
            linkedin_profile: data.lindedInProfile || "",
         };

         if (req.file) {
            //update without saving image
            reqBody["image"] = extractFilePath(req.file);
            const team = await prisma.team.findUnique({
               where: { id: data.id },
            });
            deleteFileFromUrl(team?.image as string);
         }

         // console.log(validated.value);
         const team = await prisma.team.update({
            where: { id: data.id },
            data: reqBody,
         });
         res.status(200).json({ data: team });
      } catch (error) {
         errorHandler(error as Error, req, res);
      }
   }
);

router.delete("/", authenticateJWT, async (req, res) => {
   deleteRecord(req, res, "team");
});

export default router;
