import { useState } from 'react';
import { ThumbsDown, MessageSquareX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import EscalationForm from './EscalationForm';

interface NotSatisfiedButtonProps {
  chatSessionId?: string;
  context?: string;
  className?: string;
}

const NotSatisfiedButton = ({ chatSessionId, context, className }: NotSatisfiedButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`text-orange-600 border-orange-200 hover:bg-orange-50 ${className}`}
        >
          <ThumbsDown className="h-4 w-4 mr-2" />
          Not Satisfied
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquareX className="h-5 w-5 text-orange-500" />
            Need Further Assistance?
          </DialogTitle>
          <DialogDescription>
            We're sorry the current response didn't fully resolve your issue. 
            Please provide more details and our support team will help you directly.
          </DialogDescription>
        </DialogHeader>
        <EscalationForm 
          chatSessionId={chatSessionId}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NotSatisfiedButton;