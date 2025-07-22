import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, MessageCircle, Phone } from 'lucide-react';
import FAQSection from '@/components/FAQSection';
import ChatInterface from '@/components/ChatInterface';
import EscalationForm from '@/components/EscalationForm';

const Index = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Electric Scooter Support</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.phone}
            </span>
            <Button variant="ghost" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Welcome to Customer Portal</h2>
          <p className="text-xl text-muted-foreground">
            Get help with your electric scooter
          </p>
        </div>

        <Tabs defaultValue="faq" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Live Chat
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact Us
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq" className="mt-6">
            <FAQSection />
          </TabsContent>
          
          <TabsContent value="chat" className="mt-6">
            <ChatInterface />
          </TabsContent>
          
          <TabsContent value="contact" className="mt-6">
            <EscalationForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
