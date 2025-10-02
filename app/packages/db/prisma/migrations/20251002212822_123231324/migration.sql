/*
  Warnings:

  - Added the required column `tensorPath` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `triggerWord` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ModelTrainingStatusEnum" AS ENUM ('Pending', 'Generated', 'Failed');

-- AlterTable
ALTER TABLE "public"."Model" ADD COLUMN     "falAiRequestId" TEXT,
ADD COLUMN     "tensorPath" TEXT NOT NULL,
ADD COLUMN     "trainingStatus" "public"."ModelTrainingStatusEnum" NOT NULL DEFAULT 'Pending',
ADD COLUMN     "triggerWord" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."OutputImages" ADD COLUMN     "falAiRequestId" TEXT;
