-- Migration: Add ChatInteraction table
-- Created: 2024-12-29

-- Create ChatInteraction table
CREATE TABLE IF NOT EXISTS "ChatInteraction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userMessage" TEXT NOT NULL,
    "aiResponse" TEXT NOT NULL,
    "context" JSONB,
    "metadata" JSONB,
    "userRating" INTEGER,
    "userFeedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatInteraction_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraint
ALTER TABLE "ChatInteraction" ADD CONSTRAINT "ChatInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create indexes for better performance
CREATE INDEX "ChatInteraction_userId_idx" ON "ChatInteraction"("userId");
CREATE INDEX "ChatInteraction_createdAt_idx" ON "ChatInteraction"("createdAt");

-- Add comment
COMMENT ON TABLE "ChatInteraction" IS 'Stores AI chat interactions for user coaching';
