-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "contactno_one" VARCHAR(255) NOT NULL,
    "contactno_two" VARCHAR(255),
    "email_one" VARCHAR(255) NOT NULL,
    "email_two" VARCHAR(255),
    "default" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);
