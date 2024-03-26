/*
  Warnings:

  - Added the required column `duration` to the `tracks_files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tracks_files" ADD COLUMN     "duration" INTEGER NOT NULL;
