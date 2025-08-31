/*
  Warnings:

  - You are about to drop the column `fabricWeight` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `fitType` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `hasLoops` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `hasVents` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."products" DROP COLUMN "fabricWeight",
DROP COLUMN "fitType",
DROP COLUMN "hasLoops",
DROP COLUMN "hasVents";
