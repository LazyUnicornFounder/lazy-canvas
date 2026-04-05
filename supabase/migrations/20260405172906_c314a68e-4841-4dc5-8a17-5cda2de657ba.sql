
-- Add 'pro' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'pro';

-- Add status column to gallery_submissions for approval workflow
ALTER TABLE public.gallery_submissions ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_gallery_submissions_status ON public.gallery_submissions(status);
