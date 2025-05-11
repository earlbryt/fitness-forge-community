import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Calendar, Edit, Image, MapPin, User } from 'lucide-react';
import useWorkoutAuth from '@/hooks/useWorkoutAuth';
import { Badge } from '@/components/ui/badge';

interface ProfileData {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useWorkoutAuth();
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let profileId = userId;
        
        // If no userId provided, use the current user's ID
        if (!profileId && user) {
          profileId = user.id;
        }
        
        if (!profileId) {
          setError('No profile ID provided');
          setIsLoading(false);
          return;
        }
        
        // Set flag to check if viewing current user's profile
        if (user && profileId === user.id) {
          setIsCurrentUser(true);
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          setError('Could not load profile');
        } else if (data) {
          setProfile(data as ProfileData);
        } else {
          setError('Profile not found');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId, user]);
  
  if (isLoading) {
    return <ProfileSkeleton />;
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 mb-4">{error}</div>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-gray-500 mb-4">Profile not found</div>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }
  
  const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Profile Image */}
            <div className="relative">
              <Avatar className="h-32 w-32">
                {profile.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={profile.username} />
                ) : (
                  <AvatarFallback className="bg-brand-primary text-white text-4xl">
                    {(profile.full_name || profile.username)?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              {isCurrentUser && (
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8"
                  onClick={() => {/* TODO: Implement avatar upload */}}
                >
                  <Image size={14} />
                </Button>
              )}
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-1">{profile.full_name || profile.username}</h1>
                  <div className="flex items-center gap-2 justify-center md:justify-start text-gray-500 mb-4">
                    <Calendar size={14} />
                    <span className="text-sm">Joined {joinDate}</span>
                  </div>
                </div>
                
                {isCurrentUser && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mb-4"
                    onClick={() => {/* TODO: Implement edit profile */}}
                  >
                    <Edit size={14} className="mr-1" /> Edit Profile
                  </Button>
                )}
              </div>
              
              {/* Bio */}
              <div className="mb-4">
                <p className="text-gray-700">
                  {profile.bio || (isCurrentUser ? 
                    'Your bio is empty. Click Edit Profile to add a bio.' : 
                    'This user has not added a bio yet.')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="activity" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <div className="mb-2">No recent activity to display</div>
                <p className="text-sm">Activities will appear here once available</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workouts">
          <Card>
            <CardHeader>
              <CardTitle>Workout History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <div className="mb-2">No workouts recorded yet</div>
                <p className="text-sm">Workouts will appear here once logged</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="challenges">
          <Card>
            <CardHeader>
              <CardTitle>Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <div className="mb-2">No challenges joined yet</div>
                <p className="text-sm">Challenges will appear here once participated</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <div className="mb-2">No achievements earned yet</div>
                <p className="text-sm">Achievements will appear here as you reach milestones</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ProfileSkeleton = () => (
  <div className="container mx-auto p-4">
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="flex-1 text-center md:text-left space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <div className="mb-6">
      <Skeleton className="h-10 w-full max-w-md mb-6" />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Profile;
