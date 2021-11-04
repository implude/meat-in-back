/*
  Warnings:

  - A unique constraint covering the columns `[numeric_level]` on the table `Difficulty` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Ad" (
    "id" UUID NOT NULL,
    "img" TEXT NOT NULL DEFAULT E'',
    "title" TEXT NOT NULL DEFAULT E'',
    "description" TEXT NOT NULL DEFAULT E'',
    "target_url" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Difficulty_numeric_level_key" ON "Difficulty"("numeric_level");
