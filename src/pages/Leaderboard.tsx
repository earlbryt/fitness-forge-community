
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, Medal, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useWorkoutAuth from '@/hooks/useWorkoutAuth';

// Define types for our leaderboard data
interface LeaderboardUser {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  initials: string;
  workout_count: number;
  challenges_won: number;
  rank?: number;
  change?: 'up' | 'down' | null;
}

const Leaderboard = () => {
  const { getUserId } = useWorkoutAuth();
  const [userRank, setUserRank] = useState<{ workouts: number, challenges: number } | null>(null);
  const currentUserId = getUserId();
  
  // Fetch workout leaderboard data
  const { data: workoutLeaderboard = [], isLoading: isWorkoutLoading } = useQuery({
    queryKey: ['leaderboard', 'workouts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id:id,
          full_name,
          avatar_url,
          workouts:workouts(count)
        `)
        .order('workouts', { ascending: false });
        
      if (error) throw error;
      
      // Map and format the data
      const formattedData = data.map((item: any, index: number) => {
        // Generate initials from user's full name
        const initials = item.full_name 
          ? item.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
          : 'U';
        
        // Apply rank
        const rank = index + 1;
        
        return {
          id: item.id,
          user_id: item.id,
          full_name: item.full_name || 'Anonymous User',
          avatar_url: item.avatar_url,
          initials,
          workout_count: item.workouts[0]?.count || 0,
          challenges_won: 0, // This will be filled in the challenges query
          rank,
          // Randomly assign trend changes for visual interest
          change: Math.random() > 0.5 ? 'up' : 'down'
        };
      });
      
      // Set current user rank for workouts
      const userRankData = formattedData.find(user => user.user_id === currentUserId);
      if (userRankData) {
        setUserRank(prev => ({ 
          ...prev || {}, 
          workouts: userRankData.rank || 0 
        }));
      }
      
      return formattedData.slice(0, 10); // Return only top 10
    },
    refetchOnWindowFocus: false
  });
  
  // Fetch challenges leaderboard data
  const { data: challengesLeaderboard = [], isLoading: isChallengesLoading } = useQuery({
    queryKey: ['leaderboard', 'challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id:id,
          full_name,
          avatar_url,
          challenges_won:challenges(count)
        `)
        .order('challenges_won', { ascending: false });
        
      if (error) throw error;
      
      // Map and format the data
      const formattedData = data.map((item: any, index: number) => {
        // Generate initials from user's full name
        const initials = item.full_name 
          ? item.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
          : 'U';
        
        // Apply rank
        const rank = index + 1;
        
        return {
          id: item.id,
          user_id: item.id,
          full_name: item.full_name || 'Anonymous User',
          avatar_url: item.avatar_url,
          initials,
          workout_count: 0, // This was filled in the workouts query
          challenges_won: item.challenges_won[0]?.count || 0,
          rank,
          // Randomly assign trend changes for visual interest
          change: Math.random() > 0.5 ? 'up' : 'down'
        };
      });
      
      // Set current user rank for challenges
      const userRankData = formattedData.find(user => user.user_id === currentUserId);
      if (userRankData) {
        setUserRank(prev => ({ 
          ...prev || {}, 
          challenges: userRankData.rank || 0 
        }));
      }
      
      return formattedData.slice(0, 10); // Return only top 10
    },
    refetchOnWindowFocus: false
  });

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-gray-500">See how you rank against other community members</p>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Rank:</p>
            <div className="font-semibold text-lg">
              <span className="mr-2">#{userRank?.workouts || '-'} (Workouts)</span>
              <span className="text-gray-400 mx-2">|</span>
              <span className="ml-2">#{userRank?.challenges || '-'} (Challenges)</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="workouts" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="workouts">Most Workouts</TabsTrigger>
          <TabsTrigger value="challenges">Most Challenges Won</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workouts" className="pt-2">
          <h2 className="text-xl font-semibold mb-2">Top 10 by Workout Count</h2>
          <p className="text-sm text-gray-500 mb-4">Users with the most verified workouts</p>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="space-y-1">
              {isWorkoutLoading ? (
                <div className="flex justify-center py-6">
                  <p>Loading leaderboard data...</p>
                </div>
              ) : workoutLeaderboard.length === 0 ? (
                <div className="flex justify-center py-6">
                  <p>No workout data available</p>
                </div>
              ) : (
                workoutLeaderboard.map((user) => (
                  <LeaderboardItem 
                    key={user.id}
                    rank={user.rank || 0}
                    initials={user.initials}
                    name={user.full_name || 'Anonymous User'}
                    avatarUrl={user.avatar_url || undefined}
                    value={user.workout_count}
                    trend={user.change}
                    medal={user.rank === 1 ? "gold" : user.rank === 2 ? "silver" : user.rank === 3 ? "bronze" : undefined}
                  />
                ))
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="challenges" className="pt-2">
          <h2 className="text-xl font-semibold mb-2">Top 10 by Challenges Won</h2>
          <p className="text-sm text-gray-500 mb-4">Users who have completed the most challenges</p>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="space-y-1">
              {isChallengesLoading ? (
                <div className="flex justify-center py-6">
                  <p>Loading leaderboard data...</p>
                </div>
              ) : challengesLeaderboard.length === 0 ? (
                <div className="flex justify-center py-6">
                  <p>No challenge data available</p>
                </div>
              ) : (
                challengesLeaderboard.map((user) => (
                  <LeaderboardItem 
                    key={user.id}
                    rank={user.rank || 0}
                    initials={user.initials}
                    name={user.full_name || 'Anonymous User'}
                    avatarUrl={user.avatar_url || undefined}
                    value={user.challenges_won}
                    trend={user.change}
                    medal={user.rank === 1 ? "gold" : user.rank === 2 ? "silver" : user.rank === 3 ? "bronze" : undefined}
                    type="challenges"
                  />
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface LeaderboardItemProps {
  rank: number;
  initials: string;
  name: string;
  avatarUrl?: string;
  value: number;
  trend?: "up" | "down";
  medal?: "gold" | "silver" | "bronze";
  type?: "workouts" | "challenges";
}

const LeaderboardItem = ({ 
  rank, initials, name, avatarUrl, value, trend, medal, type = "workouts" 
}: LeaderboardItemProps) => {
  return (
    <div className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
      <div className="flex items-center gap-4">
        {medal ? (
          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
            medal === "gold" 
              ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300" 
              : medal === "silver" 
              ? "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300" 
              : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
          }`}>
            <Trophy className="w-4 h-4" />
          </div>
        ) : (
          <div className="w-8 h-8 flex items-center justify-center">
            <span className="text-gray-400 font-medium">#{rank}</span>
          </div>
        )}
        
        <Avatar className="h-8 w-8">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
          <AvatarFallback className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <span className="font-medium">{name}</span>
      </div>
      
      <div className="flex items-center">
        <span className="font-semibold mr-2">
          {value} {type}
        </span>
        {trend && (
          <span>
            {trend === "up" ? (
              <ArrowUpRight size={16} className="text-brand-success" />
            ) : (
              <ArrowDownRight size={16} className="text-brand-danger" />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
