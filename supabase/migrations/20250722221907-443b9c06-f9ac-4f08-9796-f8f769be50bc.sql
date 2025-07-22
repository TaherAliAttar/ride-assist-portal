-- Create unresolved queries table
CREATE TABLE public.unresolved_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  query TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  chat_session_id UUID REFERENCES public.chat_sessions(id) ON DELETE SET NULL,
  contact_method TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.unresolved_queries ENABLE ROW LEVEL SECURITY;

-- Create policies for unresolved queries
CREATE POLICY "Users can view their own unresolved queries" 
ON public.unresolved_queries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own unresolved queries" 
ON public.unresolved_queries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create trigger for unresolved queries updated_at
CREATE TRIGGER update_unresolved_queries_updated_at
BEFORE UPDATE ON public.unresolved_queries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_unresolved_queries_user_id ON public.unresolved_queries(user_id);
CREATE INDEX idx_unresolved_queries_status ON public.unresolved_queries(status);
CREATE INDEX idx_unresolved_queries_created_at ON public.unresolved_queries(created_at);