-- DropIndex
DROP INDEX "Badge_userId_clientMod_name_key";

-- AlterTable
ALTER TABLE "Badge" ALTER COLUMN "name" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Badge_clientMod_idx" ON "Badge"("clientMod");
