-- CreateTable
CREATE TABLE "pages_banners" (
    "id" TEXT NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "alt" VARCHAR(255),
    "title" VARCHAR(255),
    "page" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_banners_pkey" PRIMARY KEY ("id")
);
