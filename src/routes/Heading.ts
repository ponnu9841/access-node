import { Router } from "express";
import { authenticateJWT } from "../utils/auth-middleware";
import prisma from "../utils/prisma";
import { deleteRecord } from "../utils/delete-request";
import { errorHandler } from "../utils/error-handler";

const router = Router();

router.get("/", async (req, res) => {
   try {
      const headings = await prisma.heading.findMany({
         select: {
            id: true,
            title: true,
            description: true,
            section: true,
         },
      });
      res.status(200).json({ data: headings });
   } catch (error) {
      errorHandler(error as Error, req, res);
   }
});

router.post("/", authenticateJWT, async (req, res) => {
   const data = req.body;
   try {
      const reqBody = {
         title: data.title,
         description: data.description,
         section: data.section,
      };
      const heading = await prisma.heading.create({
         data: reqBody,
      });
      res.status(200).json({ data: heading });
   } catch (error) {
      errorHandler(error as Error, req, res);
   }
});

router.put("/", authenticateJWT, async (req, res) => {
   try {
      const data = req.body;
      const reqBody = {
        title: data.title,
        description: data.description || "",
        section: data.section,
     };

      // console.log(validated.value);
      const heading = await prisma.heading.update({
         where: { id: data.id },
         data: reqBody,
      });
      res.status(200).json({ data: heading });
   } catch (error) {
      errorHandler(error as Error, req, res);
   }
});

router.delete("/", authenticateJWT, async (req, res) => {
   deleteRecord(req, res, "heading", false);
});

export default router;
