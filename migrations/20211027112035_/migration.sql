-- AlterTable
ALTER TABLE "User" ADD COLUMN     "nickname" TEXT NOT NULL DEFAULT E'',
ALTER COLUMN "password" DROP NOT NULL;