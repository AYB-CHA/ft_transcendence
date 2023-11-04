/*
  Warnings:

  - You are about to drop the column `mutedAt` on the `ChannelsOnUsers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChannelsOnUsers" DROP COLUMN "mutedAt",
ADD COLUMN     "mutedUntil" TIMESTAMP(3);
