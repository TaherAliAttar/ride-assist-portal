-- Add admin policies for viewing all unresolved queries
CREATE POLICY "Admins can view all unresolved queries" 
ON public.unresolved_queries 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = auth.email()
  )
);

-- Add admin policies for updating unresolved queries
CREATE POLICY "Admins can update unresolved queries" 
ON public.unresolved_queries 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = auth.email()
  )
);