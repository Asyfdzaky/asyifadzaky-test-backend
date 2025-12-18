/*
  Warnings:

  - You are about to drop the column `name` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Tourist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Tourist" DROP COLUMN "fullName";
