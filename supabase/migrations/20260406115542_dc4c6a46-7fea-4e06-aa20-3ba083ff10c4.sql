
-- Create user_images table
CREATE TABLE public.user_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL DEFAULT '',
  file_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own images"
ON public.user_images FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own images"
ON public.user_images FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images"
ON public.user_images FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('user-images', 'user-images', true);

-- Storage policies: users can only access their own folder (user_id/*)
CREATE POLICY "Users can upload to their own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own uploads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'user-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'user-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Public read access for serving images via URL
CREATE POLICY "Public read access for user images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-images');
