import { Request, Response } from "express";
import { deleteFileFromUrl } from "./file";
import prisma from "./prisma";

export const deleteRecord = async (
    req: Request,
    res: Response,
    modelName: keyof typeof prisma
) => {
    const { id, image } = req.query;

    if (!id || !image) {
        res.status(404).json({ message: "Image or Id not found" });
        return;
    }

    try {
        // Delete associated file if necessary
        deleteFileFromUrl(image as string);

        // Delete the record dynamically
        await (prisma[modelName] as any).delete({
            where: { id: id as string },
        });

        res.status(200).json({ message: "Record deleted successfully" });
    } catch (error) {
        console.error("Error deleting record:", error);
        res.status(500).json({ message: "Failed to delete record" });
    }
};