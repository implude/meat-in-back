/*
  Warnings:

  - You are about to drop the column `img` on the `Ad` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ad" DROP COLUMN "img",
ADD COLUMN     "image" TEXT NOT NULL DEFAULT E'';
