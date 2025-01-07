/*
  Warnings:

  - Added the required column `job_area_id` to the `service_provider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `service_provider` ADD COLUMN `job_area_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `job_area` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `job_area_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `service_provider` ADD CONSTRAINT `service_provider_job_area_id_fkey` FOREIGN KEY (`job_area_id`) REFERENCES `job_area`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
