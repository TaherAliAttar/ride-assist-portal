import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export const useFAQs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('category', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  const searchFAQs = (query: string, category?: string) => {
    let filtered = faqs;

    if (category && category !== 'All') {
      filtered = filtered.filter(faq => faq.category === category);
    }

    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm) ||
        faq.answer.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  };

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  return {
    faqs,
    loading,
    error,
    searchFAQs,
    categories,
    refetch: fetchFAQs
  };
};