import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle } from 'lucide-react';
import FAQSection from '@/components/FAQSection';

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
            <TabsTrigger value="chat">Live Chat</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq" className="mt-6">
            <FAQSection />
          </TabsContent>
          
          <TabsContent value="chat" className="mt-6">
            <div className="text-center p-8 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
              <p className="text-muted-foreground mb-4">Chat with our support team</p>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </div>
          </TabsContent>
          
          <TabsContent value="contact" className="mt-6">
            <div className="text-center p-8 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
              <p className="text-muted-foreground mb-4">Submit a support request</p>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
