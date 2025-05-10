import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Database, XCircle } from 'lucide-react';

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [projectInfo, setProjectInfo] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    const testConnection = async () => {
      try {
        setConnectionStatus('testing');
        // Simple query to test connection
        const { data, error } = await supabase.from('_realtime').select('*').limit(1);
        
        if (error) {
          console.error('Supabase connection error:', error);
          setConnectionStatus('error');
          setConnectionError(error.message);
          return;
        }
        
        // Get project information
        const { data: configData } = await supabase.rpc('get_project_settings');
        setProjectInfo(configData);
        setConnectionStatus('success');
      } catch (err: any) {
        console.error('Unexpected error testing Supabase:', err);
        setConnectionStatus('error');
        setConnectionError(err.message || 'Unknown error occurred');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-2">Supabase Connection Test</h1>
      <p className="text-gray-500 mb-6">Testing connection to your Supabase project.</p>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {connectionStatus === 'testing' && (
            <Alert className="bg-blue-50 border-blue-200">
              <div className="animate-pulse h-5 w-5 bg-blue-500 rounded-full" />
              <AlertTitle className="text-blue-700">Testing Connection</AlertTitle>
              <AlertDescription className="text-blue-600">
                Connecting to Supabase...
              </AlertDescription>
            </Alert>
          )}
          
          {connectionStatus === 'success' && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-700">Connection Successful</AlertTitle>
              <AlertDescription className="text-green-600">
                Connected to Supabase project: {projectInfo?.project_name || 'fitplanet'}
              </AlertDescription>
            </Alert>
          )}
          
          {connectionStatus === 'error' && (
            <Alert variant="destructive">
              <XCircle className="h-5 w-5" />
              <AlertTitle>Connection Failed</AlertTitle>
              <AlertDescription>
                {connectionError || 'Unable to connect to Supabase'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-2">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-700">Authenticated</AlertTitle>
                <AlertDescription className="text-green-600">
                  Logged in as: {user.email}
                </AlertDescription>
              </Alert>
              <div>
                <h3 className="text-sm font-medium mb-1">User Details:</h3>
                <pre className="text-xs bg-gray-50 p-3 rounded-md overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <Alert className="bg-orange-50 border-orange-200">
              <AlertTitle className="text-orange-700">Not Authenticated</AlertTitle>
              <AlertDescription className="text-orange-600">
                You are not currently logged in.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Supabase Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <h3 className="text-sm font-medium">Project URL:</h3>
              <code className="text-xs bg-gray-50 p-2 rounded block mt-1">
                https://ghbuxqhlclzkhgydyoih.supabase.co
              </code>
            </div>
            <div>
              <h3 className="text-sm font-medium">Auth Configuration:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                <li>Email sign-in: Enabled</li>
                <li>Email confirmation: Disabled</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button asChild className="bg-brand-primary hover:bg-brand-primary/90">
          <a href="/app">Back to Dashboard</a>
        </Button>
      </div>
    </div>
  );
};

export default SupabaseTest; 