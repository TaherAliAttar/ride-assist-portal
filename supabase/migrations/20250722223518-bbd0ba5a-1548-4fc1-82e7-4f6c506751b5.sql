-- Add admin policies for FAQ management
CREATE POLICY "Admins can insert FAQs" 
ON public.faqs 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = auth.email()
  )
);

CREATE POLICY "Admins can update FAQs" 
ON public.faqs 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = auth.email()
  )
);

CREATE POLICY "Admins can delete FAQs" 
ON public.faqs 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = auth.email()
  )
);