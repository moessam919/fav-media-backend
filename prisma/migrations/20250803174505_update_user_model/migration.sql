/*
  Warnings:

  - You are about to drop the column `userId` on the `Media` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Media` DROP FOREIGN KEY `Media_userId_fkey`;

-- DropIndex
DROP INDEX `Media_userId_fkey` ON `Media`;

-- AlterTable
ALTER TABLE `Media` DROP COLUMN `userId`;
