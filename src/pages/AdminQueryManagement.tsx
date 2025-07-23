import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UnresolvedQuery {
  id: string;
  query: string;
  status: string;
  contact_method: string | null;
  priority: string;
  created_at: string;
  user_id: string;
  chat_session_id: string | null;
}

const AdminQueryManagement = () => {
  const { user } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [queries, setQueries] = useState<UnresolvedQuery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('unresolved_queries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setQueries(data || []);
    } catch (error) {
      console.error('Error fetching queries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch queries. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsResolved = async (queryId: string) => {
    try {
      const { error } = await supabase
        .from('unresolved_queries')
        .update({ status: 'resolved' })
        .eq('id', queryId);

      if (error) {
        throw error;
      }

      // Update local state
      setQueries(queries.map(query => 
        query.id === queryId ? { ...query, status: 'resolved' } : query
      ));

      toast({
        title: "Success",
        description: "Query marked as resolved.",
      });
    } catch (error) {
      console.error('Error updating query:', error);
      toast({
        title: "Error",
        description: "Failed to update query status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-secondary text-secondary-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <XCircle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'in_progress': return 'bg-blue-500 text-white';
      case 'resolved': return 'bg-green-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Query Management</h1>
          </div>
          <span className="text-sm text-muted-foreground">
            {user?.email}
          </span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Unresolved Customer Queries</CardTitle>
            <CardDescription>
              View and manage customer queries that need attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : queries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No queries found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Query</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Contact Method</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queries.map((query) => (
                    <TableRow key={query.id}>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={query.query}>
                          {query.query}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`flex items-center gap-1 ${getStatusColor(query.status)}`}>
                          {getStatusIcon(query.status)}
                          {query.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(query.priority)}>
                          {query.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {query.contact_method || 'Not specified'}
                      </TableCell>
                      <TableCell>
                        {new Date(query.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {query.status !== 'resolved' && (
                          <Button
                            size="sm"
                            onClick={() => markAsResolved(query.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Mark Resolved
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminQueryManagement;