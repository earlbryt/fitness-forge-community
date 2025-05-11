
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Activity, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const { signUp } = useAuth();
  const { toast } = useToast();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const validateUsername = () => {
    if (!username.trim()) {
      setAuthMessage('Full name is required');
      return false;
    }
    
    if (username.length < 2) {
      setAuthMessage('Full name must be at least 2 characters');
      return false;
    }
    
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setPasswordError('');
    setAuthMessage('');
    
    // Validate username and password
    if (!validateUsername() || !validatePassword()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const { error, success, message } = await signUp(email, password, username);
      
      if (error) {
        console.error('Signup error:', error);
        setAuthMessage(error.message || "Failed to create account");
        toast({
          title: "Registration error",
          description: error.message || "Failed to create account",
          variant: "destructive",
        });
      } else if (message) {
        // Show informational message (like email confirmation required)
        setAuthMessage(message);
        toast({
          title: success ? "Account created" : "Registration notice",
          description: message,
          variant: success ? "default" : "destructive",
        });
      } else if (success) {
        toast({
          title: "Account created!",
          description: "Your account has been created successfully.",
        });
      }
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      setAuthMessage(error.message || "An unexpected error occurred");
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-3">
            <Activity size={40} className="text-brand-secondary" />
          </div>
          <h1 className="text-2xl font-bold">
            <span className="text-brand-primary">Fit</span>
            <span className="text-brand-secondary">Community</span>
          </h1>
          <p className="text-gray-600 mt-2">Create a new account to get started</p>
        </div>

        <Card className="border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create your account and start your fitness journey</CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              {authMessage && (
                <Alert variant="destructive" className="bg-orange-50 border-orange-200">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-700">
                    {authMessage}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Full Name</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="John Doe" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your.email@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {passwordError && (
                  <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-brand-primary hover:bg-brand-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
              <p className="text-sm text-gray-600 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-brand-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-brand-primary">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
