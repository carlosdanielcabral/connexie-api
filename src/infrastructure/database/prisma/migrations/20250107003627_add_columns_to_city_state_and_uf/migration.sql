/*
  Warnings:

  - Added the required column `city` to the `service_provider_address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `service_provider_address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uf` to the `service_provider_address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `service_provider_address` ADD COLUMN `city` VARCHAR(255) NOT NULL,
    ADD COLUMN `state` VARCHAR(20) NOT NULL,
    ADD COLUMN `uf` VARCHAR(2) NOT NULL;
