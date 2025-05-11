
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, Users, Calendar, Award, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import useWorkoutAuth from '@/hooks/useWorkoutAuth';

const Dashboard = () => {
  const { getUserId } = useWorkoutAuth();
  const userId = getUserId();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats', userId],
    queryFn: async () => {
      // Fetch total workouts
      const { data: workouts, error: workoutsError } = await supabase
        .from('workouts')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);
      
      if (workoutsError) throw workoutsError;
      
      // Fetch active challenges
      const { data: challenges, error: challengesError } = await supabase
        .from('challenges')
        .select('*, challenge_participants!inner(*)')
        .eq('challenge_participants.user_id', userId)
        .eq('status', 'active');
      
      if (challengesError) throw challengesError;
      
      // Fetch challenges won
      const { data: challengesWon, error: wonError } = await supabase
        .from('challenges')
        .select('*')
        .eq('winner_id', userId);
      
      if (wonError) throw wonError;
      
      // Fetch global rank (simplified for now - could be improved)
      const { data: allUsers, error: rankError } = await supabase
        .from('profiles')
        .select('id, workouts:workouts(count)');
      
      if (rankError) throw rankError;
      
      // Sort users by workout count to determine rank
      const sortedUsers = allUsers.sort((a, b) => {
        const countA = a.workouts?.[0]?.count || 0;
        const countB = b.workouts?.[0]?.count || 0;
        return countB - countA;
      });
      
      // Find current user's rank
      const userIndex = sortedUsers.findIndex(user => user.id === userId);
      const rank = userIndex !== -1 ? userIndex + 1 : null;
      
      return {
        totalWorkouts: workouts?.length || 0,
        activeChallenges: challenges?.length || 0,
        challengesWon: challengesWon?.length || 0,
        globalRank: rank !== null ? `#${rank}` : 'N/A'
      };
    },
    refetchOnWindowFocus: false
  });

  // Fetch user's active challenges for the overview section
  const { data: activeChallenges } = useQuery({
    queryKey: ['activeChallenges', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          id, title, condition_type, condition_value, condition_unit,
          challenge_participants!inner(id, progress, user_id)
        `)
        .eq('challenge_participants.user_id', userId)
        .eq('status', 'active')
        .limit(2);
      
      if (error) throw error;
      
      return data.map(challenge => {
        const participant = challenge.challenge_participants?.[0];
        let progressPercent = 0;
        
        if (participant && challenge.condition_value > 0) {
          progressPercent = Math.min((participant.progress / challenge.condition_value) * 100, 100);
        }
        
        return {
          id: challenge.id,
          title: challenge.title,
          progress: progressPercent,
          status: `${participant?.progress || 0}/${challenge.condition_value} ${challenge.condition_unit}`
        };
      });
    },
    refetchOnWindowFocus: false
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Track your fitness journey and connect with your community.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Workouts" 
          value={isLoading ? "..." : stats?.totalWorkouts.toString() || "0"} 
          change="+2 from last week" 
          icon={<Activity className="text-indigo-500" />} 
        />
        <StatCard 
          title="Active Challenges" 
          value={isLoading ? "..." : stats?.activeChallenges.toString() || "0"} 
          change="+1 new this week" 
          icon={<Award className="text-pink-500" />} 
        />
        <StatCard 
          title="Challenges Won" 
          value={isLoading ? "..." : stats?.challengesWon.toString() || "0"} 
          change="+2 this month" 
          icon={<Trophy className="text-purple-500" />} 
        />
        <StatCard 
          title="Global Rank" 
          value={isLoading ? "..." : stats?.globalRank || "N/A"} 
          change="Up 5 positions" 
          icon={<BarChart3 className="text-emerald-500" />} 
        />
      </div>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-2">
          <h2 className="text-xl font-semibold mb-4">Active Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeChallenges?.map(challenge => (
              <ChallengeProgress 
                key={challenge.id}
                title={challenge.title}
                icon={<TrendingUp className="text-brand-primary" />}
                progress={challenge.progress} 
                status={challenge.status} 
              />
            ))}
            {(!activeChallenges || activeChallenges.length === 0) && (
              <div className="col-span-2 text-center py-10">
                <p className="text-gray-500">No active challenges. Join or create a challenge to get started!</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="challenges" className="pt-2">
          <h2 className="text-xl font-semibold mb-4">All Your Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ChallengeCard 
              title="30-Day Run Challenge"
              type="Group"
              description="Run 50 miles in 30 days"
              progress={66}
              daysLeft={10}
            />
            <ChallengeCard 
              title="Weekly Workout Streak"
              type="Group"
              description="7 days of consecutive workouts"
              progress={57}
              daysLeft={3}
            />
            <ChallengeCard 
              title="Strength Training"
              type="One-on-One"
              description="Complete 12 strength sessions"
              progress={66}
              daysLeft={14}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, icon }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="bg-gray-100 dark:bg-slate-800 p-2 rounded-lg">
            {React.cloneElement(icon as React.ReactElement, { size: 20 })}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{change}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const Trophy = ({ className }: { className?: string }) => (
  <Award className={className} />
);

interface ChallengeProgressProps {
  title: string;
  progress: number;
  status: string;
  icon: React.ReactNode;
}

const ChallengeProgress = ({ title, progress, status, icon }: ChallengeProgressProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h3 className="font-semibold">{title}</h3>
        </div>
        <Progress value={progress} className="mb-2 h-2" />
        <div className="flex justify-end">
          <span className="text-sm text-gray-500">{status}</span>
        </div>
      </CardContent>
    </Card>
  );
};

interface ChallengeCardProps {
  title: string;
  type: string;
  description: string;
  progress: number;
  daysLeft: number;
}

const ChallengeCard = ({ title, type, description, progress, daysLeft }: ChallengeCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-2">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{type}</span>
        </div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        
        <p className="text-sm font-medium mb-1">Progress</p>
        <Progress value={progress} className="mb-3 h-2" />
        <p className="text-sm text-gray-500">{daysLeft} days left</p>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
