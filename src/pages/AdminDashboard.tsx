import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, MessageSquare, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const { user, signOut } = useAdminAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin-auth');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                FAQ Management
              </CardTitle>
              <CardDescription>
                Add, edit, and delete FAQ items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                onClick={() => navigate('/admin/faqs')}
              >
                Manage FAQs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Query Management
              </CardTitle>
              <CardDescription>
                View and manage unresolved queries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                onClick={() => navigate('/admin/queries')}
              >
                View Queries
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure system preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to the Admin Portal</CardTitle>
              <CardDescription>
                Manage your electric scooter support system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use the cards above to navigate to different sections of the admin portal.
                You can manage FAQs, review customer queries, and configure system settings.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;