
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Trophy } from 'lucide-react';
import { CreateChallengeForm } from '@/components/challenges/CreateChallengeForm';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { Challenge } from '@/types/social';
import { getCurrentUser, getChallenges } from '@/services/social';
import { toast } from 'sonner';

const Challenges = () => {
  const [isCreatingChallenge, setIsCreatingChallenge] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Get current user
        const user = await getCurrentUser();
        if (user) {
          setCurrentUserId(user.id);
        }
        
        // Get challenges
        const challengesData = await getChallenges();
        setChallenges(challengesData);
      } catch (error) {
        console.error('Error fetching challenges:', error);
        toast.error('Failed to load challenges');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleRefreshChallenges = async () => {
    try {
      const challengesData = await getChallenges();
      setChallenges(challengesData);
    } catch (error) {
      console.error('Error refreshing challenges:', error);
    }
  };
  
  const activeChallenges = challenges.filter(challenge => challenge.status === 'active');
  const pendingChallenges = challenges.filter(challenge => challenge.status === 'pending');
  const completedChallenges = challenges.filter(challenge => challenge.status === 'completed');
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Challenges</h1>
          <p className="text-gray-500">Compete with friends and stay motivated with fitness challenges</p>
        </div>
        <div>
          <Button 
            className="bg-brand-primary hover:bg-brand-primary/90"
            onClick={() => setIsCreatingChallenge(true)}
            disabled={isCreatingChallenge}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Challenge
          </Button>
        </div>
      </div>
      
      {isCreatingChallenge ? (
        <CreateChallengeForm 
          onChallengeCreated={() => {
            setIsCreatingChallenge(false);
            handleRefreshChallenges();
          }}
          onCancel={() => setIsCreatingChallenge(false)}
        />
      ) : null}

      <Tabs defaultValue="active" className="mb-8">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="pt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-pulse h-56" />
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-pulse h-56" />
            </div>
          ) : activeChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeChallenges.map(challenge => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge}
                  currentUserId={currentUserId || ''}
                  onChallengeUpdated={handleRefreshChallenges}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Trophy className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-500">No active challenges</h3>
              <p className="text-gray-400 mt-1 mb-4">Create or accept a challenge to get started</p>
              <Button 
                onClick={() => setIsCreatingChallenge(true)}
                className="mx-auto"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Challenge
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="pt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-pulse h-56" />
            </div>
          ) : pendingChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingChallenges.map(challenge => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge}
                  currentUserId={currentUserId || ''}
                  onChallengeUpdated={handleRefreshChallenges}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium text-gray-500">No pending challenges</h3>
              <p className="text-gray-400 mt-1">Create a challenge to get started</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="pt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-pulse h-56" />
            </div>
          ) : completedChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedChallenges.map(challenge => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge}
                  currentUserId={currentUserId || ''}
                  onChallengeUpdated={handleRefreshChallenges}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium text-gray-500">No completed challenges yet</h3>
              <p className="text-gray-400 mt-1">Challenges you complete will appear here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Challenges;
