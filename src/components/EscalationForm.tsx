import { useState } from 'react';
import { AlertTriangle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface EscalationFormProps {
  chatSessionId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EscalationForm = ({ chatSessionId, onSuccess, onCancel }: EscalationFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [priority, setPriority] = useState('normal');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !query.trim()) {
      toast({
        title: "Error",
        description: "Please describe your issue before submitting.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('unresolved_queries')
        .insert({
          user_id: user.id,
          query: query.trim(),
          chat_session_id: chatSessionId || null,
          contact_method: contactMethod || null,
          priority
        });

      if (error) throw error;

      toast({
        title: "Query Submitted Successfully",
        description: "Our support team will review your query and get back to you soon.",
      });

      // Reset form
      setQuery('');
      setContactMethod('');
      setPriority('normal');
      
      onSuccess?.();

    } catch (error) {
      console.error('Error submitting escalation:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your query. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Submit Unresolved Query
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="query">Describe your issue *</Label>
            <Textarea
              id="query"
              placeholder="Please provide details about your unresolved issue..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="contact-method">Preferred Contact Method</Label>
            <Select value={contactMethod} onValueChange={setContactMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select contact method (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="chat">Live Chat Follow-up</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priority Level</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - General inquiry</SelectItem>
                <SelectItem value="normal">Normal - Standard issue</SelectItem>
                <SelectItem value="high">High - Affecting scooter use</SelectItem>
                <SelectItem value="urgent">Urgent - Safety concern</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={submitting || !query.trim()}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {submitting ? 'Submitting...' : 'Submit Query'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EscalationForm;