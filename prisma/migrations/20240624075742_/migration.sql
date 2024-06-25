/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "qna" (
    "id" BIGSERIAL NOT NULL,
    "question" VARCHAR NOT NULL DEFAULT '',
    "answer" VARCHAR NOT NULL DEFAULT '',
    "position" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qna_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "qna_question_key" ON "qna"("question");

-- CreateIndex
CREATE UNIQUE INDEX "qna_position_key" ON "qna"("position");
