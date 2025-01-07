/*
  Warnings:

  - Added the required column `job_mode` to the `service_provider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `service_provider` ADD COLUMN `job_mode` ENUM('remote', 'onsite', 'both') NOT NULL;

-- CreateTable
CREATE TABLE `service_provider_address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `service_provider_id` CHAR(36) NOT NULL,
    `cep` VARCHAR(8) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `service_provider_address` ADD CONSTRAINT `service_provider_address_service_provider_id_fkey` FOREIGN KEY (`service_provider_id`) REFERENCES `service_provider`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
