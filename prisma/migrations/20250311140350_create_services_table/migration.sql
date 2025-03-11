-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "alt" TEXT,
    "short_description" TEXT NOT NULL,
    "long_description" TEXT,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);
