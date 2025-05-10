
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const Challenges = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Challenges</h1>
          <p className="text-gray-500">Compete with friends and stay motivated with fitness challenges</p>
        </div>
        <div>
          <Button className="bg-brand-primary hover:bg-brand-primary/90">
            Create New Challenge
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="mb-8">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        
        <TabsContent value="pending" className="pt-6">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-gray-500">No pending challenges</h3>
            <p className="text-gray-400 mt-1">Create or join a challenge to get started</p>
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ChallengeCard 
              title="10K Steps Daily"
              type="Group"
              description="Walk 10,000 steps every day for 2 weeks"
              progress={100}
              daysLeft={0}
              completed={true}
            />
            <ChallengeCard 
              title="Morning Yoga"
              type="Group"
              description="Complete 10 morning yoga sessions"
              progress={100}
              daysLeft={0}
              completed={true}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ChallengeCardProps {
  title: string;
  type: string;
  description: string;
  progress: number;
  daysLeft: number;
  completed?: boolean;
}

const ChallengeCard = ({ title, type, description, progress, daysLeft, completed = false }: ChallengeCardProps) => {
  return (
    <div className={`bg-white p-5 rounded-lg border shadow-sm ${completed ? 'border-brand-success/20' : 'border-gray-100'}`}>
      <div className="mb-2">
        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{type}</span>
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      
      <p className="text-sm font-medium mb-1">Progress</p>
      <Progress 
        value={progress} 
        className="h-2 mb-2" 
        indicatorClassName={completed ? 'bg-brand-success' : 'bg-brand-primary'} 
      />
      
      {completed ? (
        <div className="flex items-center mt-2">
          <span className="text-sm text-brand-success font-medium">Challenge completed!</span>
        </div>
      ) : (
        <p className="text-sm text-gray-500">{daysLeft} days left</p>
      )}
    </div>
  );
};

export default Challenges;
