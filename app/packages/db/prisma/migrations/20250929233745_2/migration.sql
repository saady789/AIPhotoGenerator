/*
  Warnings:

  - Added the required column `prompt` to the `OutputImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `OutputImages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."OutputEnum" AS ENUM ('Pending', 'Generated', 'Failed');

-- AlterTable
ALTER TABLE "public"."OutputImages" ADD COLUMN     "prompt" TEXT NOT NULL,
ADD COLUMN     "status" "public"."OutputEnum" NOT NULL;
