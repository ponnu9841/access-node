-- CreateTable
CREATE TABLE "grievance_officer" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "contact" VARCHAR(255) NOT NULL,
    "designation" VARCHAR(255) NOT NULL,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grievance_officer_pkey" PRIMARY KEY ("id")
);
