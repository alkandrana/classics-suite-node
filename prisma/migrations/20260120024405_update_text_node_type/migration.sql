/*
  Warnings:

  - The values [LATIN,GREEK,HEBREW] on the enum `Language` will be removed. If these variants are still used in the database, this will fail.
  - The values [BOOK,SECTION,LINE] on the enum `TextNodeType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `language` on the `Opus` table. All the data in the column will be lost.
  - Added the required column `language` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dialect` to the `Opus` table without a default value. This is not possible if the table is not empty.

*/

-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "language" "Language" NOT NULL;

-- AlterTable
ALTER TABLE "Opus" DROP COLUMN "language",
                   ADD COLUMN     "dialect" "Language" NOT NULL;

-- AlterEnum
BEGIN;
CREATE TYPE "Language_new" AS ENUM ('Latin', 'Greek', 'Hebrew');
ALTER TABLE "Author" ALTER COLUMN "language" TYPE "Language_new" USING ("language"::text::"Language_new");
ALTER TABLE "Opus" ALTER COLUMN "dialect" TYPE "Language_new" USING ("dialect"::text::"Language_new");
ALTER TABLE "Vocab" ALTER COLUMN "language" TYPE "Language_new" USING ("language"::text::"Language_new");
ALTER TYPE "Language" RENAME TO "Language_old";
ALTER TYPE "Language_new" RENAME TO "Language";
DROP TYPE "public"."Language_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TextNodeType_new" AS ENUM ('Book', 'Section', 'Line');
ALTER TABLE "TextNode" ALTER COLUMN "type" TYPE "TextNodeType_new" USING ("type"::text::"TextNodeType_new");
ALTER TYPE "TextNodeType" RENAME TO "TextNodeType_old";
ALTER TYPE "TextNodeType_new" RENAME TO "TextNodeType";
DROP TYPE "public"."TextNodeType_old";
COMMIT;


