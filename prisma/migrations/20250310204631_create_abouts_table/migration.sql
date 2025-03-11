-- CreateTable
CREATE TABLE "abouts" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "sub_title" VARCHAR(255),
    "image_one" TEXT NOT NULL,
    "image_two" TEXT NOT NULL,
    "image_one_alt" TEXT,
    "image_two_alt" TEXT,
    "short_description" TEXT NOT NULL,
    "long_description" TEXT,

    CONSTRAINT "abouts_pkey" PRIMARY KEY ("id")
);
