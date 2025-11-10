-- Create products table to store all generated digital products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  benefits TEXT[] NOT NULL DEFAULT '{}',
  price_range TEXT NOT NULL,
  hashtags TEXT[] NOT NULL DEFAULT '{}',
  social_caption TEXT NOT NULL,
  pdf_url TEXT,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'uploaded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create trending_topics table to store AI-discovered trends
CREATE TABLE public.trending_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  explanation TEXT NOT NULL,
  relevance_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trending_topics ENABLE ROW LEVEL SECURITY;

-- Public read access for products (no auth required for this use case)
CREATE POLICY "Anyone can view products"
ON public.products
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert products"
ON public.products
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update products"
ON public.products
FOR UPDATE
USING (true);

-- Public access for trending topics
CREATE POLICY "Anyone can view trending topics"
ON public.trending_topics
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert trending topics"
ON public.trending_topics
FOR INSERT
WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for products
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets for product files
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('product-pdfs', 'product-pdfs', true),
  ('product-covers', 'product-covers', true);

-- Storage policies for PDFs
CREATE POLICY "Public PDF access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-pdfs');

CREATE POLICY "Anyone can upload PDFs"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'product-pdfs');

-- Storage policies for cover images
CREATE POLICY "Public cover image access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-covers');

CREATE POLICY "Anyone can upload cover images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'product-covers');