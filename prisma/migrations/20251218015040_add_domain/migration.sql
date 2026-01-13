-- CreateEnum
CREATE TYPE "Language" AS ENUM ('LATIN', 'GREEK', 'HEBREW');

-- CreateEnum
CREATE TYPE "TextNodeType" AS ENUM ('BOOK', 'SECTION', 'LINE');

-- CreateTable
CREATE TABLE "Opus" (
    "opusId" CITEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "language" "Language" NOT NULL,
    "authorId" CITEXT NOT NULL,

    CONSTRAINT "Opus_pkey" PRIMARY KEY ("authorId","opusId")
);

-- CreateTable
CREATE TABLE "TextNode" (
    "id" SERIAL NOT NULL,
    "type" "TextNodeType" NOT NULL,
    "label" VARCHAR(255),
    "ordinal" INTEGER NOT NULL,
    "text" TEXT,
    "authorId" CITEXT NOT NULL,
    "opusId" CITEXT NOT NULL,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TextNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vocab" (
    "id" SERIAL NOT NULL,
    "lemma" VARCHAR(255) NOT NULL,
    "translation" VARCHAR(255) NOT NULL,
    "pos" VARCHAR(20),
    "language" "Language",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vocab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "phrase" VARCHAR(50) NOT NULL,
    "note" VARCHAR(255) NOT NULL,
    "nodeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VocabOccurrence" (
    "nodeId" INTEGER NOT NULL,
    "vocabId" INTEGER NOT NULL,
    "occurrence" VARCHAR(50),
    "form" VARCHAR(50),
    "pos" VARCHAR(20),
    "startIndex" INTEGER,
    "endIndex" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VocabOccurrence_pkey" PRIMARY KEY ("vocabId","nodeId")
);

-- CreateIndex
CREATE INDEX "TextNode_authorId_opusId_parentId_ordinal_idx" ON "TextNode"("authorId", "opusId", "parentId", "ordinal");

-- CreateIndex
CREATE UNIQUE INDEX "TextNode_authorId_opusId_parentId_ordinal_key" ON "TextNode"("authorId", "opusId", "parentId", "ordinal");

-- CreateIndex
CREATE INDEX "Vocab_language_lemma_idx" ON "Vocab"("language", "lemma");

-- CreateIndex
CREATE INDEX "Comment_nodeId_idx" ON "Comment"("nodeId");

-- CreateIndex
CREATE INDEX "VocabOccurrence_nodeId_idx" ON "VocabOccurrence"("nodeId");

-- AddForeignKey
ALTER TABLE "Opus" ADD CONSTRAINT "Opus_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("authorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextNode" ADD CONSTRAINT "TextNode_authorId_opusId_fkey" FOREIGN KEY ("authorId", "opusId") REFERENCES "Opus"("authorId", "opusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextNode" ADD CONSTRAINT "TextNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "TextNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "TextNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabOccurrence" ADD CONSTRAINT "VocabOccurrence_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "TextNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabOccurrence" ADD CONSTRAINT "VocabOccurrence_vocabId_fkey" FOREIGN KEY ("vocabId") REFERENCES "Vocab"("id") ON DELETE CASCADE ON UPDATE CASCADE;
