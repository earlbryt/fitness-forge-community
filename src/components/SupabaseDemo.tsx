import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SupabaseDemo() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [projectInfo, setProjectInfo] = useState<any>(null);

  const checkConnection = async () => {
    try {
      setStatus('loading');
      setMessage('Checking connection to Supabase...');
      
      // A simple query to check if we're connected
      const { data, error } = await supabase.from('fake_table').select('*').limit(1).catch(() => ({
        data: null,
        error: { message: 'Table does not exist, but connection successful' }
      }));
      
      if (error && !error.message.includes('does not exist')) {
        throw error;
      }
      
      // Get Supabase project info
      const projectUrl = supabase.supabaseUrl;
      
      setProjectInfo({
        url: projectUrl,
        project: projectUrl.split('https://')[1].split('.supabase')[0],
      });
      
      setStatus('success');
      setMessage('Successfully connected to Supabase!');
    } catch (error: any) {
      console.error('Connection error:', error);
      setStatus('error');
      setMessage(`Connection error: ${error.message || 'Unknown error'}`);
    }
  };

  const createDemoTable = async () => {
    try {
      setStatus('loading');
      setMessage('Creating demo table...');
      
      // Try to create a simple demo table
      const { error } = await supabase.rpc('create_demo_table', {
        table_name: 'demo_items'
      }).catch(() => ({
        error: { message: 'RPC not available - please create table through Supabase dashboard' }
      }));
      
      if (error) {
        setMessage(`Note: ${error.message}. You can create tables through the Supabase dashboard.`);
      } else {
        setMessage('Demo table created successfully!');
      }
      
      setStatus('success');
    } catch (error: any) {
      console.error('Error creating table:', error);
      setStatus('error');
      setMessage(`Error: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection</CardTitle>
        <CardDescription>
          Test your connection to the Supabase project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {projectInfo && (
          <div className="space-y-2">
            <Label>Connected to project:</Label>
            <Input readOnly value={projectInfo.project} />
            <Label>Project URL:</Label>
            <Input readOnly value={projectInfo.url} />
          </div>
        )}
        
        {status !== 'idle' && (
          <div className={`p-3 rounded ${
            status === 'loading' ? 'bg-yellow-100 text-yellow-800' : 
            status === 'success' ? 'bg-green-100 text-green-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={checkConnection} 
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Checking...' : 'Test Connection'}
        </Button>
        
        <Button 
          onClick={createDemoTable} 
          disabled={status === 'loading' || status !== 'success'}
          variant="outline"
        >
          Create Demo Table
        </Button>
      </CardFooter>
    </Card>
  );
} 