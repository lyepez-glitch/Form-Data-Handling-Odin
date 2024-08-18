/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Char` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Char` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Char" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Char_name_key" ON "Char"("name");
