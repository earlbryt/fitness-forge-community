
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Activity, Users } from 'lucide-react';

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-6">Track your fitness journey and connect with your community.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Workouts" 
          value="24" 
          change="+2 from last week" 
          icon={<Activity size={20} className="text-indigo-500" />} 
        />
        <StatCard 
          title="Active Challenges" 
          value="3" 
          change="+1 new this week" 
          icon={<Activity size={20} className="text-pink-500" />} 
        />
        <StatCard 
          title="Challenges Won" 
          value="7" 
          change="+2 this month" 
          icon={<Activity size={20} className="text-purple-500" />} 
        />
        <StatCard 
          title="Global Rank" 
          value="#42" 
          change="Up 5 positions" 
          icon={<Activity size={20} className="text-emerald-500" />} 
        />
      </div>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-4">
          <h2 className="text-xl font-semibold mb-4">Active Challenges</h2>
          <div className="space-y-6">
            <ChallengeProgress 
              title="30-Day Run Challenge" 
              icon={<TrendingUp className="text-brand-primary" />}
              progress={66} 
              status="20/30 days" 
            />
            <ChallengeProgress 
              title="Weekly Workout Streak" 
              icon={<Activity className="text-brand-primary" />}
              progress={57} 
              status="4/7 days" 
            />
          </div>
        </TabsContent>
        <TabsContent value="challenges" className="pt-4">
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
    <div className="stat-card">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-500 font-medium">{title}</h3>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-gray-500">{change}</p>
      </div>
    </div>
  );
};

interface ChallengeProgressProps {
  title: string;
  progress: number;
  status: string;
  icon: React.ReactNode;
}

const ChallengeProgress = ({ title, progress, status, icon }: ChallengeProgressProps) => {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="progress-bar mb-1">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-end">
        <span className="text-sm text-gray-500">{status}</span>
      </div>
    </div>
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
    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
      <div className="mb-2">
        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{type}</span>
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      
      <p className="text-sm font-medium mb-1">Progress</p>
      <div className="progress-bar mb-3">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-500">{daysLeft} days left</p>
    </div>
  );
};

export default Dashboard;
