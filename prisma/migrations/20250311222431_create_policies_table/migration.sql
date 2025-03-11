-- CreateEnum
CREATE TYPE "PolicyType" AS ENUM ('privacy_policy', 'terms_conditions', 'cancellation_policy', 'return_policy');

-- CreateTable
CREATE TABLE "policies" (
    "id" TEXT NOT NULL,
    "type" "PolicyType" NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "policies_type_key" ON "policies"("type");
