-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "alt" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);
