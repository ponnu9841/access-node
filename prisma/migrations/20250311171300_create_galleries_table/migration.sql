-- CreateTable
CREATE TABLE "galleries" (
    "id" TEXT NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "alt" VARCHAR(255),
    "title" VARCHAR(255),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "galleries_pkey" PRIMARY KEY ("id")
);
