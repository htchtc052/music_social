/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,isDeleted]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isDeleted` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email_deletedAt_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "deletedAt",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_isDeleted_key" ON "users"("email", "isDeleted");
