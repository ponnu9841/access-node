/*
  Warnings:

  - Added the required column `map` to the `contacts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "map" TEXT NOT NULL,
ALTER COLUMN "location" SET DATA TYPE TEXT;
