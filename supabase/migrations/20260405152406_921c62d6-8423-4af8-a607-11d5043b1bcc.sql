-- Allow admins to insert roles (needed for self-assignment)
CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create a function to auto-assign admin role for the admin email
CREATE OR REPLACE FUNCTION public.auto_assign_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'lazy@lazyunicorn.ai' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger on auth.users
CREATE TRIGGER assign_admin_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_admin_role();