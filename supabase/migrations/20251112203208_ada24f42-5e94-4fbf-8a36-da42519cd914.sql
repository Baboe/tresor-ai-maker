-- Add new columns to products table for workbook structure
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS tagline TEXT,
ADD COLUMN IF NOT EXISTS introduction TEXT,
ADD COLUMN IF NOT EXISTS pillars JSONB,
ADD COLUMN IF NOT EXISTS worksheets TEXT[],
ADD COLUMN IF NOT EXISTS bonus_assets TEXT[],
ADD COLUMN IF NOT EXISTS reflection_questions TEXT[],
ADD COLUMN IF NOT EXISTS next_steps TEXT;