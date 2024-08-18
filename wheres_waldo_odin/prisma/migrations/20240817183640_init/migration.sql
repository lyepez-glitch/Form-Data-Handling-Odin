/*
  Warnings:

  - You are about to drop the `Chars` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Chars";

-- CreateTable
CREATE TABLE "Char" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "xcoord" INTEGER NOT NULL,
    "ycoord" INTEGER NOT NULL,

    CONSTRAINT "Char_pkey" PRIMARY KEY ("id")
);
