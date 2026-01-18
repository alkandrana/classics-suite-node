/*
  Warnings:

  - The values [BOOK,SECTION,LINE] on the enum `TextNodeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TextNodeType_new" AS ENUM ('Book', 'Section', 'Line');
ALTER TABLE "TextNode" ALTER COLUMN "type" TYPE "TextNodeType_new" USING ("type"::text::"TextNodeType_new");
ALTER TYPE "TextNodeType" RENAME TO "TextNodeType_old";
ALTER TYPE "TextNodeType_new" RENAME TO "TextNodeType";
DROP TYPE "public"."TextNodeType_old";
COMMIT;
