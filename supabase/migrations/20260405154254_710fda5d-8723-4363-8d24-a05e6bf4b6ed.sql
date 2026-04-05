
CREATE TABLE public.user_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled',
  editor_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quotes"
ON public.user_quotes FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quotes"
ON public.user_quotes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotes"
ON public.user_quotes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quotes"
ON public.user_quotes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_user_quotes_updated_at
BEFORE UPDATE ON public.user_quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
