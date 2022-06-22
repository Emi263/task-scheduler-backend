-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "image" TEXT NOT NULL DEFAULT E'',
ALTER COLUMN "shouldNotify" SET DEFAULT false;
