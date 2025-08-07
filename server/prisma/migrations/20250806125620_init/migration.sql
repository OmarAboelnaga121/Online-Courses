/*
  Warnings:

  - You are about to drop the `_EnrolledStudents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_WishlistedBy` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `courseId` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "_EnrolledStudents" DROP CONSTRAINT "_EnrolledStudents_A_fkey";

-- DropForeignKey
ALTER TABLE "_EnrolledStudents" DROP CONSTRAINT "_EnrolledStudents_B_fkey";

-- DropForeignKey
ALTER TABLE "_WishlistedBy" DROP CONSTRAINT "_WishlistedBy_A_fkey";

-- DropForeignKey
ALTER TABLE "_WishlistedBy" DROP CONSTRAINT "_WishlistedBy_B_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "studentsEnrolled" TEXT[];

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "courseId",
ADD COLUMN     "courseId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "enrolledCourses" TEXT[],
ADD COLUMN     "wishList" TEXT[];

-- DropTable
DROP TABLE "_EnrolledStudents";

-- DropTable
DROP TABLE "_WishlistedBy";
