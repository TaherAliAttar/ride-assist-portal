import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export const useAdminFAQs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      console.log('Fetching FAQs...');
      
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('FAQ fetch result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch FAQs. Please ensure you're logged in as an admin.",
        variant: "destructive",
      });
      // Still set FAQs to empty array so loading stops
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const createFAQ = async (faq: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .insert([faq])
        .select()
        .single();

      if (error) throw error;

      setFaqs(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "FAQ created successfully",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error creating FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to create FAQ",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateFAQ = async (id: string, updates: Partial<Omit<FAQ, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setFaqs(prev => prev.map(faq => faq.id === id ? data : faq));
      toast({
        title: "Success",
        description: "FAQ updated successfully",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error updating FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to update FAQ",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteFAQ = async (id: string) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFaqs(prev => prev.filter(faq => faq.id !== id));
      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  return {
    faqs,
    loading,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    refetch: fetchFAQs,
  };
};