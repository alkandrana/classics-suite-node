-- Enable case insensitivity
CREATE EXTENSION IF NOT EXISTS CITEXT;
-- CreateTable
CREATE TABLE "Author" (
    "authorId" CITEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "praenomen" VARCHAR(255),
    "nomen" VARCHAR(255),
    "cognomen" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("authorId")
);


