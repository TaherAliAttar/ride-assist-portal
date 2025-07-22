import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Message {
  id: string;
  session_id: string;
  message: string;
  is_user_message: boolean;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useChat = () => {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user) {
      initializeChat();
    }
  }, [user]);

  const initializeChat = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get or create the latest chat session
      const { data: sessions, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (sessionError) throw sessionError;

      let session = sessions?.[0];

      if (!session) {
        // Create new session
        const { data: newSession, error: createError } = await supabase
          .from('chat_sessions')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (createError) throw createError;
        session = newSession;
      }

      setCurrentSession(session);

      // Load messages for this session
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);

    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!currentSession || !user || !message.trim()) return;

    try {
      setSending(true);

      // Add user message to UI immediately
      const userMessage: Message = {
        id: 'temp-' + Date.now(),
        session_id: currentSession.id,
        message: message.trim(),
        is_user_message: true,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, userMessage]);

      // Call the chat response edge function
      const { data, error } = await supabase.functions.invoke('chat-response', {
        body: {
          message: message.trim(),
          sessionId: currentSession.id,
        },
      });

      if (error) throw error;

      // Refresh messages to get the actual saved messages with proper IDs
      const { data: updatedMessages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', currentSession.id)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(updatedMessages || []);

    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the temporary message on error
      setMessages(prev => prev.filter(m => !m.id.startsWith('temp-')));
    } finally {
      setSending(false);
    }
  };

  const startNewSession = async () => {
    if (!user) return;

    try {
      const { data: newSession, error } = await supabase
        .from('chat_sessions')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(newSession);
      setMessages([]);
    } catch (error) {
      console.error('Error creating new session:', error);
    }
  };

  return {
    currentSession,
    messages,
    loading,
    sending,
    sendMessage,
    startNewSession,
  };
};