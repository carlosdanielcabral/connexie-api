/*
  Warnings:

  - The primary key for the `service_provider_address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cep` on the `service_provider_address` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `service_provider_address` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `service_provider_address` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `service_provider_address` table. All the data in the column will be lost.
  - You are about to drop the column `uf` on the `service_provider_address` table. All the data in the column will be lost.
  - Added the required column `address_id` to the `service_provider_address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `service_provider_address` DROP PRIMARY KEY,
    DROP COLUMN `cep`,
    DROP COLUMN `city`,
    DROP COLUMN `id`,
    DROP COLUMN `state`,
    DROP COLUMN `uf`,
    ADD COLUMN `address_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`service_provider_id`, `address_id`);

-- CreateTable
CREATE TABLE `address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cep` VARCHAR(8) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `state` VARCHAR(20) NOT NULL,
    `uf` VARCHAR(2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `address_cep_city_state_uf_key`(`cep`, `city`, `state`, `uf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `service_provider_address` ADD CONSTRAINT `service_provider_address_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
