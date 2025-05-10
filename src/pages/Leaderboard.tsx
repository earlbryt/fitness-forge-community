
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Leaderboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Leaderboard</h1>
      <p className="text-gray-500 mb-6">See how you rank against other community members</p>
      
      <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 mb-1">Your Rank:</p>
            <div className="font-semibold text-lg">
              <span className="mr-2">#42 (Workouts)</span>
              <span className="text-gray-400">|</span>
              <span className="ml-2">#31 (Challenges)</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500 mr-1">Time Period:</p>
            <Select defaultValue="month">
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="workouts" className="mb-8">
        <TabsList>
          <TabsTrigger value="workouts">Most Workouts</TabsTrigger>
          <TabsTrigger value="challenges">Most Challenges Won</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workouts" className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Top 10 by Workout Count</h2>
          <p className="text-sm text-gray-500 mb-4">Users with the most verified workouts</p>
          
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="space-y-4 divide-y divide-gray-100">
              <LeaderboardItem 
                rank={1}
                initials="SJ"
                name="Sarah Johnson"
                value={42}
                trend="up"
                medal="gold"
              />
              <LeaderboardItem 
                rank={2}
                initials="MC"
                name="Michael Chen"
                value={38}
                trend="up"
                medal="silver"
              />
              <LeaderboardItem 
                rank={3}
                initials="JW"
                name="Jessica Williams"
                value={35}
                trend="down"
                medal="bronze"
              />
              <LeaderboardItem 
                rank={4}
                initials="DK"
                name="David Kim"
                value={33}
              />
              <LeaderboardItem 
                rank={5}
                initials="ED"
                name="Emily Davis"
                value={31}
                trend="up"
              />
              <LeaderboardItem 
                rank={6}
                initials="JW"
                name="James Wilson"
                value={29}
                trend="down"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="challenges" className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Top 10 by Challenges Won</h2>
          <p className="text-sm text-gray-500 mb-4">Users who have completed the most challenges</p>
          
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="space-y-4 divide-y divide-gray-100">
              <LeaderboardItem 
                rank={1}
                initials="MC"
                name="Michael Chen"
                value={15}
                trend="up"
                medal="gold"
                type="challenges"
              />
              <LeaderboardItem 
                rank={2}
                initials="SJ"
                name="Sarah Johnson"
                value={12}
                trend="up"
                medal="silver"
                type="challenges"
              />
              <LeaderboardItem 
                rank={3}
                initials="ED"
                name="Emily Davis"
                value={10}
                medal="bronze"
                type="challenges"
              />
              <LeaderboardItem 
                rank={4}
                initials="JW"
                name="Jessica Williams"
                value={9}
                trend="up"
                type="challenges"
              />
              <LeaderboardItem 
                rank={5}
                initials="DK"
                name="David Kim"
                value={8}
                trend="down"
                type="challenges"
              />
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
  value: number;
  trend?: "up" | "down";
  medal?: "gold" | "silver" | "bronze";
  type?: "workouts" | "challenges";
}

const LeaderboardItem = ({ 
  rank, initials, name, value, trend, medal, type = "workouts" 
}: LeaderboardItemProps) => {
  return (
    <div className="px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {medal ? (
          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
            medal === "gold" 
              ? "bg-amber-100 text-amber-600" 
              : medal === "silver" 
              ? "bg-gray-100 text-gray-500" 
              : "bg-amber-50 text-amber-700"
          }`}>
            <MedalIcon type={medal} />
          </div>
        ) : (
          <div className="w-8 h-8 flex items-center justify-center">
            <span className="text-gray-400 font-medium">#{rank}</span>
          </div>
        )}
        
        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center">
          {initials}
        </div>
        
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

const MedalIcon = ({ type }: { type: "gold" | "silver" | "bronze" }) => {
  const colors = {
    gold: "text-amber-500",
    silver: "text-gray-400",
    bronze: "text-amber-700"
  };
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={`w-5 h-5 ${colors[type]}`}
    >
      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
    </svg>
  );
};

export default Leaderboard;
