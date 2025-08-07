/*
  Warnings:

  - You are about to drop the column `studentsEnrolled` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `enrolledCourses` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `wishList` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "studentsEnrolled";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "enrolledCourses",
DROP COLUMN "wishList";

-- CreateTable
CREATE TABLE "_EnrolledStudents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EnrolledStudents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_WishlistedBy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WishlistedBy_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EnrolledStudents_B_index" ON "_EnrolledStudents"("B");

-- CreateIndex
CREATE INDEX "_WishlistedBy_B_index" ON "_WishlistedBy"("B");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnrolledStudents" ADD CONSTRAINT "_EnrolledStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnrolledStudents" ADD CONSTRAINT "_EnrolledStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WishlistedBy" ADD CONSTRAINT "_WishlistedBy_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WishlistedBy" ADD CONSTRAINT "_WishlistedBy_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
