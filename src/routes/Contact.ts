import { Router } from "express";
import { authenticateJWT } from "../utils/auth-middleware";
import prisma from "../utils/prisma";
import { deleteRecord } from "../utils/delete-request";
import { errorHandler } from "../utils/error-handler";

const router = Router();

router.get("/", async (req, res) => {
   try {
      const contact = await prisma.contact.findMany({
         select: {
            id: true,
            location: true,
            map: true,
            contactno_one: true,
            contactno_two: true,
            email_one: true,
            email_two: true,
            default: true,
         },
      });
      contact?.sort((e) => e.default === true ? -1 : 1);
      res.status(200).json({ data: contact });
   } catch (error) {
      errorHandler(error as Error, req, res);
   }
});

router.post("/", authenticateJWT, async (req, res) => {
   const data = req.body;
   try {
      const reqBody = {
         location: data.location,
         map: data.map,
         contactno_one: data.contactOne,
         contactno_two: data.contactTwo,
         email_one: data.emailOne,
         email_two: data.emailTwo,
      };
      const contact = await prisma.contact.create({
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
         location: data.location,
         map: data.map,
         contactno_one: data.contactOne,
         contactno_two: data.contactTwo || "",
         email_one: data.emailOne,
         email_two: data.emailTwo || "",
      };

      // console.log(validated.value);
      const contact = await prisma.contact.update({
         where: { id: data.id },
         data: reqBody,
      });
      res.status(200).json({ data: contact });
   } catch (error) {
      errorHandler(error as Error, req, res);
   }
});

router.put("/mark-as-default", authenticateJWT, async (req, res) => {
   try {
      const { id } = req.body;
      if (!id) {
         res.status(400).json({ message: "ID is required" });
         return;
      }
      // Start a transaction
      await prisma.$transaction([
         // Set all contacts' default to false
         prisma.contact.updateMany({
            data: { default: false },
         }),
         // Set the selected contact's default to true
         prisma.contact.update({
            where: { id },
            data: { default: true },
         }),
      ]);

      res.status(200).json({
         message: "Contact marked as default successfully",
      });
   } catch (error) {}
});

router.delete("/", authenticateJWT, async (req, res) => {
   deleteRecord(req, res, "contact", false);
});

export default router;
