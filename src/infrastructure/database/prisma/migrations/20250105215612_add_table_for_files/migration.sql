/*
  Warnings:

  - You are about to drop the column `profileImage` on the `service_provider` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `service_provider` DROP COLUMN `profileImage`,
    ADD COLUMN `profileImageId` INTEGER NULL;

-- CreateTable
CREATE TABLE `file` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `originalName` VARCHAR(255) NOT NULL,
    `enconding` VARCHAR(36) NOT NULL,
    `mimeType` VARCHAR(255) NOT NULL,
    `blobName` VARCHAR(255) NOT NULL,
    `size` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `service_provider` ADD CONSTRAINT `service_provider_profileImageId_fkey` FOREIGN KEY (`profileImageId`) REFERENCES `file`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
