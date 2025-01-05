/*
  Warnings:

  - You are about to drop the column `enconding` on the `file` table. All the data in the column will be lost.
  - Added the required column `encoding` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `file` DROP COLUMN `enconding`,
    ADD COLUMN `encoding` VARCHAR(36) NOT NULL;
