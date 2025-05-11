
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Database } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SupabaseDemo() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [projectInfo, setProjectInfo] = useState<{ url: string; project: string } | null>(null);
  
  const testConnection = async () => {
    try {
      setStatus('loading');
      setMessage('Checking connection to Supabase...');
      
      // A simple query to check if we're connected
      const { data, error } = await supabase
        .from('fake_table')
        .select('*')
        .limit(1);
      
      // Even if the table doesn't exist, we can confirm connection was successful
      const connectionSuccessful = !error || error.message.includes('does not exist');
      
      if (!connectionSuccessful) {
        throw new Error(`Connection error: ${error.message}`);
      }
      
      // Get Supabase project info from URL
      const url = new URL(supabase.getUrl()).toString();
      const projectName = new URL(url).hostname.split('.')[0];
      
      setProjectInfo({
        url: url,
        project: projectName,
      });
      
      setStatus('success');
      setMessage('Successfully connected to Supabase!');
    } catch (error: any) {
      setStatus('error');
      setMessage(`Connection error: ${error.message}`);
      console.error('Supabase connection error:', error);
    }
  };
  
  const createTable = async () => {
    try {
      setStatus('loading');
      setMessage('Creating demo table...');
      
      // Try to create a simple demo table using SQL query
      const { error } = await supabase.rpc('create_demo_table', {
        table_name: 'demo_items'
      });
      
      if (error) {
        // Fallback message if RPC fails
        setStatus('error');
        setMessage('Please create tables through Supabase dashboard.');
        return;
      }
      
      setStatus('success');
      setMessage('Demo table created successfully!');
    } catch (error: any) {
      setStatus('error');
      setMessage(`Error creating table: ${error.message}`);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-6 w-6" />
          Supabase Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'loading' && (
          <div className="py-4 text-center">
            <div className="animate-pulse text-blue-500">Loading...</div>
            <p className="text-sm text-gray-500 mt-2">{message}</p>
          </div>
        )}
        
        {status === 'success' && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {message}
              {projectInfo && (
                <div className="mt-2 text-sm">
                  <div>Project: <span className="font-semibold">{projectInfo.project}</span></div>
                  <div>URL: <span className="font-semibold">{projectInfo.url}</span></div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {status === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          onClick={testConnection} 
          disabled={status === 'loading'}
        >
          Test Connection
        </Button>
        {status === 'success' && (
          <Button 
            variant="outline" 
            onClick={createTable}
            disabled={status === 'loading'}
          >
            Create Demo Table
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
