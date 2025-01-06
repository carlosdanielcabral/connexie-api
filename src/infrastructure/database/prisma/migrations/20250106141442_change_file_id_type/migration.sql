/*
  Warnings:

  - The primary key for the `file` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `blobName` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `originalName` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `profileImageId` on the `service_provider` table. All the data in the column will be lost.
  - Added the required column `blob_name` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `compressed_size` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mime_type` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `original_name` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `original_size` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `service_provider` DROP FOREIGN KEY `service_provider_profileImageId_fkey`;

-- AlterTable
ALTER TABLE `file` DROP PRIMARY KEY,
    DROP COLUMN `blobName`,
    DROP COLUMN `mimeType`,
    DROP COLUMN `originalName`,
    DROP COLUMN `size`,
    ADD COLUMN `blob_name` VARCHAR(500) NOT NULL,
    ADD COLUMN `compressed_size` INTEGER NOT NULL,
    ADD COLUMN `mime_type` VARCHAR(255) NOT NULL,
    ADD COLUMN `original_name` VARCHAR(500) NOT NULL,
    ADD COLUMN `original_size` INTEGER NOT NULL,
    ADD COLUMN `url` VARCHAR(500) NOT NULL,
    MODIFY `id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `service_provider` DROP COLUMN `profileImageId`,
    ADD COLUMN `profile_image_id` CHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `service_provider` ADD CONSTRAINT `service_provider_profile_image_id_fkey` FOREIGN KEY (`profile_image_id`) REFERENCES `file`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
