/*
  Warnings:

  - Made the column `email` on table `grievance_officer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "grievance_officer" ALTER COLUMN "email" SET NOT NULL;
