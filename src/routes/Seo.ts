import { Router } from "express";
import { authenticateJWT } from "../utils/auth-middleware";
import prisma from "../utils/prisma";
import { deleteRecord } from "../utils/delete-request";
import { errorHandler } from "../utils/error-handler";

const router = Router();

router.get("/", async (req, res) => {
   try {
      const seo = await prisma.seo.findMany({
         select: {
            id: true,
            title: true,
            description: true,
            page: true,
         },
      });
      res.status(200).json({ data: seo });
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
        page: data.page,
      };
      const contact = await prisma.seo.create({
         data: reqBody,
      });
      res.status(200).json({ data: contact });
   } catch (error) {
      errorHandler(error as Error, req, res);
   }
});

router.put("/", authenticateJWT, async (req, res) => {
   try {
      const data = req.body;
      const reqBody = {
        title: data.title,
        description: data.description,
        page: data.page,
      };

      // console.log(validated.value);
      const seo = await prisma.seo.update({
         where: { id: data.id },
         data: reqBody,
      });
      res.status(200).json({ data: seo });
   } catch (error) {
      errorHandler(error as Error, req, res);
   }
});

router.delete("/", authenticateJWT, async (req, res) => {
   deleteRecord(req, res, "seo", false);
});

export default router;
