/*
  Warnings:

  - You are about to drop the column `created_at` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `profile_image_id` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `service_provider` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `service_provider` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `service_provider` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `service_provider` table. All the data in the column will be lost.
  - You are about to drop the column `profile_image_id` on the `service_provider` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `service_provider` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `customer` DROP FOREIGN KEY `customer_profile_image_id_fkey`;

-- DropForeignKey
ALTER TABLE `service_provider` DROP FOREIGN KEY `service_provider_profile_image_id_fkey`;

-- DropIndex
DROP INDEX `customer_email_key` ON `customer`;

-- DropIndex
DROP INDEX `service_provider_email_key` ON `service_provider`;

-- AlterTable
ALTER TABLE `customer` DROP COLUMN `created_at`,
    DROP COLUMN `email`,
    DROP COLUMN `name`,
    DROP COLUMN `password`,
    DROP COLUMN `profile_image_id`,
    DROP COLUMN `updated_at`;

-- AlterTable
ALTER TABLE `service_provider` DROP COLUMN `created_at`,
    DROP COLUMN `email`,
    DROP COLUMN `name`,
    DROP COLUMN `password`,
    DROP COLUMN `profile_image_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `fileId` CHAR(36) NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` CHAR(36) NOT NULL,
    `type` ENUM('1', '2') NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `profile_image_id` CHAR(36) NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_profile_image_id_fkey` FOREIGN KEY (`profile_image_id`) REFERENCES `file`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_provider` ADD CONSTRAINT `service_provider_id_fkey` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer` ADD CONSTRAINT `customer_id_fkey` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
