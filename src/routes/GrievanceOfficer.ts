import { Router } from "express";
import { authenticateJWT } from "../utils/auth-middleware";
import prisma from "../utils/prisma";
import { deleteRecord } from "../utils/delete-request";
import { errorHandler } from "../utils/error-handler";

const router = Router();

router.get("/", async (req, res) => {
   try {
      const grievanceOfficer = await prisma.grievanceOfficer.findFirst({
         select: {
            id: true,
            name: true,
            email: true,
            contact: true,
            designation: true,
            address: true,
         },
      });
      res.status(200).json({ data: grievanceOfficer });
   } catch (error) {
      errorHandler(error as Error, req, res);
   }
});

router.post("/", authenticateJWT, async (req, res) => {
   const data = req.body;
   try {
      const reqBody = {
         name: data.name,
         email: data.email,
         contact: data.contact,
         designation: data.designation,
         address: data.address,
      };
      const grievanceOfficer = await prisma.grievanceOfficer.create({
         data: reqBody,
      });
      res.status(200).json({ data: grievanceOfficer });
   } catch (error) {
      errorHandler(error as Error, req, res);
   }
});

router.put("/", authenticateJWT, async (req, res) => {
   try {
      const data = req.body;
      const reqBody = {
         name: data.name,
         email: data.email,
         contact: data.contact,
         designation: data.designation,
         address: data.address || "",
      };

      const grievanceOfficer = await prisma.grievanceOfficer.update({
         where: { id: data.id },
         data: reqBody,
      });
      res.status(200).json({ data: grievanceOfficer });
   } catch (error) {
      console.log(error);
      errorHandler(error as Error, req, res);
   }
});

router.delete("/", authenticateJWT, async (req, res) => {
   deleteRecord(req, res, "grievanceOfficer", false);
});

export default router;
