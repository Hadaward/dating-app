/*
  Warnings:

  - Added the required column `orientation` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Orientation" AS ENUM ('HETEROSEXUAL', 'BISEXUAL', 'GAY', 'LESBIAN', 'OTHER');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "orientation" "Orientation" NOT NULL;
