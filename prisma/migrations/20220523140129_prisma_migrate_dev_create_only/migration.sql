/*
  Warnings:

  - Added the required column `age` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN  "age" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "surname" TEXT NOT NULL DEFAULT '';
