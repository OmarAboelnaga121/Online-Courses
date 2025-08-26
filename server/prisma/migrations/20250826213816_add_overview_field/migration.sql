/*
  Warnings:

  - Added the required column `overView` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "overView" TEXT NOT NULL DEFAULT 'Course overview will be updated soon.';

-- Remove default after adding the column
ALTER TABLE "Course" ALTER COLUMN "overView" DROP DEFAULT;
