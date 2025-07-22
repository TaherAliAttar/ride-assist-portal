import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId } = await req.json();

    if (!message || !sessionId) {
      return new Response(
        JSON.stringify({ error: 'Message and sessionId are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Processing chat message:', message);

    // Get FAQ data for context matching
    const { data: faqs, error: faqError } = await supabase
      .from('faqs')
      .select('question, answer, category');

    if (faqError) {
      console.error('Error fetching FAQs:', faqError);
      throw faqError;
    }

    // Simple keyword matching for responses
    const response = generateResponse(message.toLowerCase(), faqs || []);

    // Save the user message
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        session_id: sessionId,
        message: message,
        is_user_message: true
      });

    if (messageError) {
      console.error('Error saving user message:', messageError);
      throw messageError;
    }

    // Save the bot response
    const { error: responseError } = await supabase
      .from('messages')
      .insert({
        session_id: sessionId,
        message: response,
        is_user_message: false
      });

    if (responseError) {
      console.error('Error saving bot response:', responseError);
      throw responseError;
    }

    // Update session timestamp
    const { error: sessionError } = await supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    if (sessionError) {
      console.error('Error updating session:', sessionError);
    }

    console.log('Chat response generated successfully');

    return new Response(
      JSON.stringify({ response }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Chat response error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function generateResponse(message: string, faqs: any[]): string {
  // Define common keywords and their responses
  const keywords = {
    'battery': ['battery', 'charge', 'charging', 'power', 'range'],
    'maintenance': ['clean', 'service', 'maintain', 'tire', 'tires'],
    'troubleshooting': ['not working', 'broken', 'problem', 'issue', 'noise', 'slow'],
    'charging': ['charge', 'charger', 'plug', 'overnight']
  };

  // Find matching FAQ based on keywords
  for (const [category, keywordList] of Object.entries(keywords)) {
    if (keywordList.some(keyword => message.includes(keyword))) {
      const categoryFAQs = faqs.filter(faq => faq.category.toLowerCase() === category);
      if (categoryFAQs.length > 0) {
        // Find the most relevant FAQ
        const relevantFAQ = categoryFAQs.find(faq => 
          keywordList.some(keyword => faq.question.toLowerCase().includes(keyword))
        ) || categoryFAQs[0];
        
        return relevantFAQ.answer;
      }
    }
  }

  // Greeting responses
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! I'm here to help you with your electric scooter. You can ask me about battery issues, charging, maintenance, or troubleshooting. What can I help you with today?";
  }

  // Thank you responses
  if (message.includes('thank') || message.includes('thanks')) {
    return "You're welcome! Is there anything else I can help you with regarding your electric scooter?";
  }

  // Default response when no match is found
  return "I understand you're asking about your electric scooter, but I don't have a specific answer for that question. You might find what you're looking for in our FAQ section, or you can contact our support team for more detailed assistance. Is there anything specific about battery, charging, maintenance, or troubleshooting I can help you with?";
}