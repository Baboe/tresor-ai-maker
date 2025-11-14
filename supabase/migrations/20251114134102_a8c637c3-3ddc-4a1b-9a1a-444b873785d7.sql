-- Create storage policies for product-pdfs bucket to allow public uploads
CREATE POLICY "Anyone can upload product PDFs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-pdfs');

CREATE POLICY "Anyone can view product PDFs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-pdfs');

CREATE POLICY "Anyone can update product PDFs" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-pdfs');

-- Create storage policies for product-covers bucket to allow public uploads
CREATE POLICY "Anyone can upload product covers" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-covers');

CREATE POLICY "Anyone can view product covers" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-covers');

CREATE POLICY "Anyone can update product covers" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-covers');