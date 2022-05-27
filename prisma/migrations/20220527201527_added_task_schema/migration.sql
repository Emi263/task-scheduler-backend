/*
  Warnings:

  - Added the required column `author` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shouldNotify` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "author" TEXT NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "shouldNotify" BOOLEAN NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
