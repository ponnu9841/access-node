import { Router } from "express";
import { authenticateJWT } from "../utils/auth-middleware";
import prisma from "../utils/prisma";
import { deleteRecord } from "../utils/delete-request";
import { errorHandler } from "../utils/error-handler";

const router = Router();

router.get("/", async (req, res) => {
   try {
      const seo = await prisma.policy.findMany({
         select: {
            id: true,
            type: true,
            content: true,
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
        type: data.type,
        content: data.content,
      };
      const policy = await prisma.policy.create({
         data: reqBody,
      });
      res.status(200).json({ data: policy });
   } catch (error) {
      errorHandler(error as Error, req, res);
   }
});

router.put("/", authenticateJWT, async (req, res) => {
   try {
      const data = req.body;
      const reqBody = {
        type: data.type,
        content: data.content,
      };

      // console.log(validated.value);
      const policy = await prisma.policy.update({
         where: { id: data.id },
         data: reqBody,
      });
      res.status(200).json({ data: policy });
   } catch (error) {
      errorHandler(error as Error, req, res);
   }
});

router.delete("/", authenticateJWT, async (req, res) => {
   deleteRecord(req, res, "policy", false);
});

export default router;
