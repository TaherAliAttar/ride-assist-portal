-- Drop the existing trigger that only handles phone users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Update the function to handle both phone and email users
CREATE OR REPLACE FUNCTION public.handle_new_phone_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert into users table if the user has a phone number
  IF NEW.phone IS NOT NULL THEN
    INSERT INTO public.users (id, phone)
    VALUES (NEW.id, NEW.phone);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Recreate the trigger for phone users only
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  WHEN (NEW.phone IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_phone_user();