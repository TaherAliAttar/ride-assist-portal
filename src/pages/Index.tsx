import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

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
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to Customer Portal</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Get help with your electric scooter
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">FAQ</h3>
              <p className="text-muted-foreground">Find answers to common questions</p>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
              <p className="text-muted-foreground">Chat with our support team</p>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
              <p className="text-muted-foreground">Submit a support request</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
